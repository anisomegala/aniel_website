import { NextResponse } from 'next/server'

// These pages are distributed directly to outreach contacts (investors, festival
// bookers) via email links + an in-page access code (karma2026, etc). They rely on
// next-sitemap's exclude + noindex for privacy from search engines, NOT on this
// middleware. DO NOT set MEMORIAS_PASSWORD / KARMA_PASSWORD in production — doing
// so would 401 every recipient of those outreach emails before they reach the
// in-page code gate. This middleware fails open and exists only as dormant
// infrastructure for a future page that needs real 1:1 access control.

// Locale-prefixed variants of each gated page (default locale 'en' has no prefix)
const GATES = [
  {
    paths: ['/memorias', '/es/memorias', '/pt/memorias', '/pl/memorias'],
    envVar: 'MEMORIAS_PASSWORD',
    realm: 'Memorias de Bras Cubas - Private Preview',
  },
  {
    paths: [
      '/karma', '/es/karma', '/pt/karma', '/pl/karma',
      '/karma/gallery', '/es/karma/gallery', '/pt/karma/gallery', '/pl/karma/gallery',
    ],
    envVar: 'KARMA_PASSWORD',
    realm: 'Karma Trio - Private Preview',
  },
]

export function middleware(request) {
  const { pathname } = request.nextUrl

  const gate = GATES.find((g) => g.paths.includes(pathname))
  if (!gate) {
    return NextResponse.next()
  }

  const password = process.env[gate.envVar]
  // Fail open if no password is configured, so local/dev setups without the
  // env var don't get locked out.
  if (!password) {
    return NextResponse.next()
  }

  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6))
    const sepIndex = decoded.indexOf(':')
    const suppliedPassword = decoded.slice(sepIndex + 1)
    if (suppliedPassword === password) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${gate.realm}"` },
  })
}

export const config = {
  matcher: [
    '/memorias', '/es/memorias', '/pt/memorias', '/pl/memorias',
    '/karma', '/es/karma', '/pt/karma', '/pl/karma',
    '/karma/gallery', '/es/karma/gallery', '/pt/karma/gallery', '/pl/karma/gallery',
  ],
}
