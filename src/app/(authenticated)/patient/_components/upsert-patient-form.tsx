'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'

import { upsertPatient } from '@/actions/patient/upsert-patient'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PatientForm, PatientFormSchema } from '@/data/schemas/patient'

export type UpsertPatientFormProps = {
  patient?: {
    id: string
    name: string
    email: string
    phoneNumber: string
    sex: 'male' | 'female'
  }
  onSuccess?: () => void
}

export function UpsertPatientForm({
  patient,
  onSuccess,
}: UpsertPatientFormProps) {
  const form = useForm<PatientForm>({
    shouldUnregister: true,
    resolver: standardSchemaResolver(PatientFormSchema),
    defaultValues: {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      sex: patient?.sex ?? undefined,
    },
  })

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success('Paciente salvo com sucesso!')
      form.reset()
      onSuccess?.()
    },
    onError: () => {
      toast.error('Ocorreu um erro ao salvar o paciente.')
    },
  })

  const onSubmit = (data: PatientForm) => {
    upsertPatientAction.execute({ ...data, id: patient?.id })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {patient?.id ? patient.name : 'Adicionar Paciente'}
            </DialogTitle>
            <DialogDescription>
              {patient?.id
                ? 'Edite as informações do paciente.'
                : 'Adicione um novo paciente.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do paciente</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de telefone</FormLabel>
                  <FormControl>
                    <PatternFormat
                      customInput={Input}
                      format="(##) #####-####"
                      allowEmptyFormatting
                      mask="_"
                      placeholder="(99) 99999-9999"
                      {...field}
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={upsertPatientAction.isPending}
              isLoading={upsertPatientAction.isPending}
            >
              {patient?.id ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
