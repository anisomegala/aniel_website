/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        pathname: '/**', // Allows all image paths from Stripe
      },
    ],
  },
}


module.exports = nextConfig
