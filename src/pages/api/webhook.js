import { buffer } from "micro";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const shippingCost = session.total_details?.amount_shipping / 100;
    // session.shipping_details is populated because you added shipping_address_collection in checkout.js
    const customerName = session.shipping_details?.name || "Valued Customer";
    const email = session.customer_details?.email;
    const address = session.shipping_details?.address;

    try {
      // 1. Fetch Line Items to identify products for the email
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      let orderSummary = "";

      for (const item of lineItems.data) {
        const product = await stripe.products.retrieve(item.price.product);
        orderSummary += `- ${item.quantity}x ${product.name}\n`;

        // 2. Inventory Management (using metadata.stock)
        if (product.metadata?.stock) {
          const currentStock = parseInt(product.metadata.stock);
          const newStock = Math.max(0, currentStock - (item.quantity || 1));

          await stripe.products.update(product.id, {
            metadata: { stock: newStock.toString() },
          });

          if (newStock === 0) {
            await stripe.products.update(product.id, { active: false });
          }
        }
      }

      // 3. Automated Notification using your existing iCloud setup
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
        subject: `📦 New Physical Order: ${customerName}`,
        text: `
          New order ready for fulfillment!

          SHIPPING TO:
          Name: ${customerName}
          Address: ${address?.line1}, ${address?.city}, ${address?.postal_code}, ${address?.country}
          Email: ${email}
          SHIPPING METHOD COST: ${shippingCost} ${session.currency.toUpperCase()}
    SHIPPING TO: ${address?.line1}, ${address?.city}, ${address?.country}
          ITEMS:
          ${orderSummary}
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Fulfillment data captured and emailed for session: ${session.id}`);

    } catch (error) {
      console.error(`❌ Fulfillment error: ${error.message}`);
      return res.status(500).json({ error: "Processing failed" });
    }
  }

  res.status(200).json({ received: true });
}