import { NextResponse } from 'next/server'

// Locale-prefixed variants of each gated page (default locale 'en' has no prefix)
const GATES = [
  {
    paths: ['/memorias', '/es/memorias', '/pt/memorias', '/pl/memorias'],
    envVar: 'MEMORIAS_PASSWORD',
    realm: 'Memorias de Bras Cubas - Private Preview',
  },
  {
    paths: ['/karma', '/es/karma', '/pt/karma', '/pl/karma'],
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
  ],
}
