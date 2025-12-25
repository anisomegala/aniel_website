import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: req.body.priceId, quantity: 1 }],
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['ES', 'PL', 'GE'], 
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/shop`,
      });
      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}