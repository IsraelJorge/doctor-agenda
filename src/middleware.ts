import { betterFetch } from '@better-fetch/fetch'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { auth } from './lib/auth'
import { Route } from './utils/routes'

type Session = Awaited<ReturnType<(typeof auth)['api']['getSession']>>

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  )

  const { pathname } = request.nextUrl

  const shouldRedirectToLogin = !session && pathname !== Route.authentication
  const shouldRedirectToClinicForm =
    !session?.user?.clinic?.id && pathname !== Route.clinicForm

  if (shouldRedirectToLogin) {
    return NextResponse.redirect(new URL(Route.authentication, request.url))
  }

  if (shouldRedirectToClinicForm) {
    return NextResponse.redirect(new URL(Route.clinicForm, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|sitemap.xml|robots.txt).*)'],
}
