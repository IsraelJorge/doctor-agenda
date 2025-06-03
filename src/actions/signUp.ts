'use server'

import { auth } from '@/lib/auth'

type SignUpData = {
  name: string
  email: string
  password: string
}

export async function signUp(data: SignUpData) {
  await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  })
}
