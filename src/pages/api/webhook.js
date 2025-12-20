import { buffer } from "micro";
import Stripe from "stripe";

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This is the signing secret from your Stripe Dashboard Webhook settings
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Next.js requirement: Disable the default body parser to allow Stripe to verify the raw signature
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the event signature
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log(`🔔 Payment received for Session: ${session.id}`);

    try {
      // 1. Fetch the line items to know what was purchased
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      for (const item of lineItems.data) {
        // 2. Retrieve the product details
        const product = await stripe.products.retrieve(item.price.product);

        // 3. Update Inventory via Metadata
        if (product.metadata && product.metadata.stock) {
          const currentStock = parseInt(product.metadata.stock);
          const quantityPurchased = item.quantity || 1;
          const newStock = Math.max(0, currentStock - quantityPurchased);

          console.log(`📦 Updating stock for ${product.name}: ${currentStock} -> ${newStock}`);

          await stripe.products.update(product.id, {
            metadata: {
              stock: newStock.toString(),
            },
          });

          // 4. Auto-Deactivate if stock hits zero
          if (newStock === 0) {
            await stripe.products.update(product.id, { active: false });
            console.log(`🚫 Product ${product.name} is now out of stock and deactivated.`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error updating inventory: ${error.message}`);
      return res.status(500).json({ error: "Inventory update failed" });
    }
  }

  // Return a 200 response to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
}