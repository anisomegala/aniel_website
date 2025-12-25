import { buffer } from "micro";
import Stripe from "stripe";
import nodemailer from "nodemailer";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Signing secret from Stripe Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable default body parser for signature verification
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
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle 'checkout.session.completed'
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 1. Extract Customer & Shipping Info for Fulfillment
    const customerName = session.shipping_details?.name || "Customer";
    const email = session.customer_details?.email;
    const address = session.shipping_details?.address;

    console.log(`🔔 Payment received for Session: ${session.id}`);

    try {
      // 2. Fetch Line Items to identify purchased products
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      let orderSummary = "";

      for (const item of lineItems.data) {
        const product = await stripe.products.retrieve(item.price.product);
        orderSummary += `- ${item.quantity}x ${product.name}\n`;

        // 3. Update Inventory via Metadata
        if (product.metadata && product.metadata.stock) {
          const currentStock = parseInt(product.metadata.stock);
          const quantityPurchased = item.quantity || 1;
          const newStock = Math.max(0, currentStock - quantityPurchased);

          await stripe.products.update(product.id, {
            metadata: { stock: newStock.toString() },
          });

          // Auto-Deactivate if stock hits zero
          if (newStock === 0) {
            await stripe.products.update(product.id, { active: false });
            console.log(`🚫 ${product.name} is now out of stock.`);
          }
        }
      }

      // 4. Send Fulfillment Notification Email to Yourself
      const transporter = nodemailer.createTransport({
        service: "icloud",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: `📦 New Order to Ship: ${customerName}`,
        text: `
          You have a new order to fulfill!

          CUSTOMER:
          Name: ${customerName}
          Email: ${email}

          SHIPPING ADDRESS:
          Street: ${address?.line1} ${address?.line2 || ""}
          City: ${address?.city}
          State: ${address?.state || "N/A"}
          Postal Code: ${address?.postal_code}
          Country: ${address?.country}

          ITEMS PURCHASED:
          ${orderSummary}
          
          Please ship the items and update the tracking in your Stripe Dashboard.
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Fulfillment email sent to artist.`);

    } catch (error) {
      console.error(`❌ Error during fulfillment process: ${error.message}`);
      return res.status(500).json({ error: "Fulfillment update failed" });
    }
  }

  res.status(200).json({ received: true });
}