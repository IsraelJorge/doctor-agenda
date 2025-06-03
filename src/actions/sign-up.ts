'use server'

import { APIError } from 'better-auth/api'

import { SignUpForm } from '@/data/schemas/sign-up'
import { auth } from '@/lib/auth'

export async function signUp(data: SignUpForm) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      asResponse: true,
    })
  } catch (error) {
    if (error instanceof APIError) {
      return error
    }
  }
}
