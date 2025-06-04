'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Route } from '@/utils/routes'

export function ButtonSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(Route.authentication)
        },
      },
    })
  }

  return <Button onClick={handleSignOut}>Sair</Button>
}
