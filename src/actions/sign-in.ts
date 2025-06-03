'use server'

import { APIError } from 'better-auth/api'

import { SignInForm } from '@/data/schemas/sign-in'
import { auth } from '@/lib/auth'

export const signIn = async (data: SignInForm) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      return error
    }
  }
}
