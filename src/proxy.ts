import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Temporary: Disabled redirect to allow public access to the leaderboard
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
