import { buffer } from "micro";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body to verify the signature
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // This verifies the message actually came from Stripe
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // LOGIC: Send digital file or update your database here
      console.log(`Payment successful for Session ID: ${session.id}`);
      console.log(`Customer Email: ${session.customer_details.email}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}