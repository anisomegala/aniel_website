import { NextResponse } from 'next/server'

// Locale-prefixed variants of /memorias (default locale 'en' has no prefix)
const PROTECTED_PATHS = ['/memorias', '/es/memorias', '/pt/memorias', '/pl/memorias']

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (!PROTECTED_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const password = process.env.MEMORIAS_PASSWORD
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
    headers: { 'WWW-Authenticate': 'Basic realm="Memorias de Bras Cubas - Private Preview"' },
  })
}

export const config = {
  matcher: ['/memorias', '/es/memorias', '/pt/memorias', '/pl/memorias'],
}
