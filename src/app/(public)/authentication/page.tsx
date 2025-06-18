import Image from 'next/image'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import logoIcon from '../../../../public/logo-icon.svg'
import { SignInForm } from './_components/sign-in-form'
import { SignUpForm } from './_components/sign-up-form'

export default function AuthenticationPage() {
  return (
    <main className="bg-background relative flex min-h-screen w-screen items-center justify-center">
      <header className="absolute top-4 right-4">
        <ModeToggle />
      </header>
      <Card className="w-full max-w-[800px] overflow-hidden p-0 shadow-xl backdrop-blur-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-foreground text-2xl font-bold">
                Bem-vindo
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Entre na sua conta ou crie uma nova
              </CardDescription>
            </CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="login" className="text-sm">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">
                  Criar conta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <SignInForm />
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
          <div className="relative hidden overflow-hidden md:block">
            <Image
              src={logoIcon}
              alt="Logo Doutor Agenda"
              width={136}
              height={28}
              className="absolute inset-0 h-full w-full scale-110 object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
