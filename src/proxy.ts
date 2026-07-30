import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Check if user is logged in
  const mockSession = request.cookies.get('mock_user_role')

  // If a user is not logged in and tries to access /dashboard, redirect them to the home page (leaderboard)
  if (!mockSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
