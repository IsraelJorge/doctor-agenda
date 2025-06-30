import { betterFetch } from '@better-fetch/fetch'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { Session } from './lib/auth/types'
import { Route } from './utils/routes'

export async function middleware(request: NextRequest) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  )

  const { pathname } = request.nextUrl

  const shouldRedirectToLogin = !session && pathname !== Route.authentication

  const shouldRedirectNewSubscription =
    !session?.user?.plan &&
    pathname !== Route.newSubscription &&
    pathname !== Route.authentication

  const shouldRedirectToClinicForm =
    !session?.user?.clinic?.id &&
    pathname !== Route.clinicForm &&
    pathname !== Route.authentication

  if (shouldRedirectToLogin) {
    return NextResponse.redirect(new URL(Route.authentication, request.url))
  }

  if (shouldRedirectNewSubscription) {
    return NextResponse.redirect(new URL(Route.newSubscription, request.url))
  }

  if (shouldRedirectToClinicForm) {
    return NextResponse.redirect(new URL(Route.clinicForm, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|sitemap.xml|robots.txt).*)'],
}
