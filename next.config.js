/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'es', 'pt', 'pl'],
    defaultLocale: 'en',
    localeDetection: true, 
  },
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
