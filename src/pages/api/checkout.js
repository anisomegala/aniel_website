import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { priceId } = req.body;

    // 1. Retrieve the price and expand the product to access metadata
    const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
    
    // Check if the product has a 'size' metadata tag
    // If it doesn't exist, we treat it as a digital product
    const productSize = price.product.metadata?.size;

    // 2. Define basic session options
    const sessionOptions = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop`,
    };

    // 3. Conditional Shipping Logic
    if (productSize) {
      console.log(`📦 Physical item detected (Size: ${productSize}). Configuring shipping...`);

      // Add address collection for physical goods
      sessionOptions.shipping_address_collection = {
        allowed_countries: [
          'AL', 'AD', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 
          'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 
          'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 
          'PL', 'PT', 'RO', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 
          'GB', 'VA'
        ],
      };

      // Fetch active shipping rates and match with product size
      const shippingRates = await stripe.shippingRates.list({ active: true });
      const matchingRate = shippingRates.data.find(
        rate => rate.metadata && rate.metadata.size === productSize
      );

      if (matchingRate) {
        sessionOptions.shipping_options = [{ shipping_rate: matchingRate.id }];
      } else {
        console.warn(`⚠️ No shipping rate found matching size: ${productSize}`);
      }
    } else {
      console.log('⚡ Digital item detected (No size metadata). Skipping shipping.');
    }

    // 4. Create the session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err.message);
    res.status(500).json({ message: err.message });
  }
}