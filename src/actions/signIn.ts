'use server'

import { APIError } from 'better-auth/api'

import { auth } from '@/lib/auth'

type SignInData = {
  email: string
  password: string
}

export const signIn = async (data: SignInData) => {
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
