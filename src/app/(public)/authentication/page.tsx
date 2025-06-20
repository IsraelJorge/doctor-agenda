import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { SignInForm } from './_components/sign-in-form'
import { SignUpForm } from './_components/sign-up-form'

export default function AuthenticationPage() {
  return (
    <main className="flex min-h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <SignInForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}
