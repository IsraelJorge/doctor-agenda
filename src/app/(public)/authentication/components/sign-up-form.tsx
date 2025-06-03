'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'

import { signUp } from '@/actions/signUp'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterFormSchema, RegisterFormType } from '@/data/schemas/register'

export function SignUpForm() {
  const form = useForm<RegisterFormType>({
    resolver: standardSchemaResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const handleRegister = async (data: RegisterFormType) => {
    try {
      await signUp(data)
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)}>
        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Crie uma conta para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
              isLoading={form.formState.isSubmitting}
            >
              Criar conta
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
