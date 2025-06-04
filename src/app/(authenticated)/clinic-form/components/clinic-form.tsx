'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createClinic } from '@/actions/create-clinic'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  ClinicForm as ClinicFormType,
  ClinicFormSchema,
} from '@/data/schemas/clinic'
import { Route } from '@/utils/routes'

export function ClinicForm() {
  const router = useRouter()

  const form = useForm<ClinicFormType>({
    resolver: standardSchemaResolver(ClinicFormSchema),
    defaultValues: {
      name: '',
    },
  })

  const handleCreateClinic = async (data: ClinicFormType) => {
    try {
      await createClinic(data)
      router.push(Route.dashboard)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao criar clínica')
    }
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar clínica</DialogTitle>
          <DialogDescription>
            Adicione uma clínica para continuar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="clinic-form"
            onSubmit={form.handleSubmit(handleCreateClinic)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="clinic-form"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            Criar clínica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
