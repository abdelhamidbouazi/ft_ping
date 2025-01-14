import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { toast } from 'react-toastify'
import axios from './app/api/axios'


export async function middleware(request: NextRequest) {
  const cookie = await request.cookies.get('jwt_token_mine')
  if (!cookie && request.nextUrl.pathname !== '/login')
    return await NextResponse.redirect(new URL('/login', request.nextUrl))
  if (cookie) {
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_IP_BACK}/users/me`, {
        method: 'GET',
        headers: {
          Cookie: `jwt_token_mine=${cookie.value}`
        }
      })
      const data = await res.json()
      if (res.status !== 200 && request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
      }
      else if (res.status === 200 && data.is_looged === false && data.isTwoFactorEnable === true && request.nextUrl.pathname !== '/2fa') {
        return NextResponse.redirect(new URL('/2fa', request.nextUrl))
      }
      else if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/2fa') && data.is_looged === true) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
      }
    } catch (error) {
      // //console.log("res", res);
      toast.error(error.message,
        {
          toastId: 'error1'
      })
    }
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|_next|icons|img|icons/logout.svg|img/logo.svg|_next/static/css/app|icons/google_logo.svg|logo42.svg|logo.svg|favicon.ico|42Logo.svg|ping.gif|pingLogo.svg).*)',
  ],

};