import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Checking for our mock session cookie
  const mockSession = request.cookies.get('mock_user_role')

  if (
    !mockSession &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
