/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://anielsomeillan.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/server-sitemap.xml', '/xpop', '/*/xpop'],
  alternateRefs: [
    { href: 'https://anielsomeillan.com',    hreflang: 'en' },
    { href: 'https://anielsomeillan.com/es', hreflang: 'es' },
    { href: 'https://anielsomeillan.com/pt', hreflang: 'pt' },
    { href: 'https://anielsomeillan.com/pl', hreflang: 'pl' },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api'] },
    ],
  },
}
