/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://anielsomeillan.com', // Replace with your actual verified domain
  generateRobotsTxt: true, // This clears the Robots.txt issue
  sitemapSize: 7000,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/server-sitemap.xml'], // Exclude internal API routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api'],
      },
    ],
  },
}