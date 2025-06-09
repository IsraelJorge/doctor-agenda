'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'

import { upsertAppointment } from '@/actions/upsert-appointment'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AppointmentForm,
  AppointmentFormSchema,
} from '@/data/schemas/appointment'
import { doctorTable, patientTable } from '@/database/schemas'

export type UpsertAppointmentFormProps = {
  patients: (typeof patientTable.$inferSelect)[]
  doctors: (typeof doctorTable.$inferSelect)[]
  appointment?: {
    id: string
    patientId: string
    doctorId: string
    appointmentPriceInCents: number
    date: Date
  }
  onSuccess?: () => void
}

function getInitialValues(
  appointment?: UpsertAppointmentFormProps['appointment'],
): AppointmentForm {
  return {
    id: appointment?.id ?? undefined,
    patientId: appointment?.patientId ?? '',
    doctorId: appointment?.doctorId ?? '',
    appointmentPrice: appointment?.appointmentPriceInCents
      ? appointment.appointmentPriceInCents / 100
      : 0,
    date: appointment?.date ? new Date(appointment.date) : new Date(),
    time: appointment?.date ? appointment.date.toTimeString().slice(0, 5) : '',
  }
}

export function UpsertAppointmentForm({
  patients,
  doctors,
  appointment,
  onSuccess,
}: UpsertAppointmentFormProps) {
  const form = useForm<AppointmentForm>({
    resolver: zodResolver(AppointmentFormSchema),
    shouldUnregister: true,
    defaultValues: getInitialValues(appointment),
  })

  const handleDoctorChange = (doctorId: string) => {
    form.setValue('doctorId', doctorId)
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      form.setValue('appointmentPrice', doctor.appointmentPriceInCents / 100)
    } else {
      form.setValue('appointmentPrice', 0)
    }
  }

  const isDoctorSelected = !!form.watch('doctorId')
  const isPatientSelected = !!form.watch('patientId')

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success('Agendamento salvo com sucesso!')
      form.reset()
      onSuccess?.()
    },
    onError: () => {
      toast.error('Ocorreu um erro ao salvar o agendamento.')
    },
  })

  const onSubmit = (data: AppointmentForm) => {
    upsertAppointmentAction.execute(data)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {appointment?.id ? 'Editar agendamento' : 'Novo agendamento'}
            </DialogTitle>
            <DialogDescription>
              {appointment?.id
                ? 'Edite as informações do agendamento.'
                : 'Preencha os dados para criar um novo agendamento.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médico</FormLabel>
                  <Select
                    onValueChange={(value) => handleDoctorChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o médico" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da consulta</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value.floatValue)
                      }}
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      allowNegative={false}
                      allowLeadingZeros={false}
                      thousandSeparator="."
                      customInput={Input}
                      prefix="R$"
                      disabled={!isDoctorSelected}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        disabled={!isDoctorSelected || !isPatientSelected}
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : 'Selecione a data'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(d) => field.onChange(d)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select
                    disabled={!isDoctorSelected || !isPatientSelected}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Manhã</SelectLabel>
                        <SelectItem value="05:00:00">05:00</SelectItem>
                        <SelectItem value="05:30:00">05:30</SelectItem>
                        <SelectItem value="06:00:00">06:00</SelectItem>
                        <SelectItem value="06:30:00">06:30</SelectItem>
                        <SelectItem value="07:00:00">07:00</SelectItem>
                        <SelectItem value="07:30:00">07:30</SelectItem>
                        <SelectItem value="08:00:00">08:00</SelectItem>
                        <SelectItem value="08:30:00">08:30</SelectItem>
                        <SelectItem value="09:00:00">09:00</SelectItem>
                        <SelectItem value="09:30:00">09:30</SelectItem>
                        <SelectItem value="10:00:00">10:00</SelectItem>
                        <SelectItem value="10:30:00">10:30</SelectItem>
                        <SelectItem value="11:00:00">11:00</SelectItem>
                        <SelectItem value="11:30:00">11:30</SelectItem>
                        <SelectItem value="12:00:00">12:00</SelectItem>
                        <SelectItem value="12:30:00">12:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Tarde</SelectLabel>
                        <SelectItem value="13:00:00">13:00</SelectItem>
                        <SelectItem value="13:30:00">13:30</SelectItem>
                        <SelectItem value="14:00:00">14:00</SelectItem>
                        <SelectItem value="14:30:00">14:30</SelectItem>
                        <SelectItem value="15:00:00">15:00</SelectItem>
                        <SelectItem value="15:30:00">15:30</SelectItem>
                        <SelectItem value="16:00:00">16:00</SelectItem>
                        <SelectItem value="16:30:00">16:30</SelectItem>
                        <SelectItem value="17:00:00">17:00</SelectItem>
                        <SelectItem value="17:30:00">17:30</SelectItem>
                        <SelectItem value="18:00:00">18:00</SelectItem>
                        <SelectItem value="18:30:00">18:30</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Noite</SelectLabel>
                        <SelectItem value="19:00:00">19:00</SelectItem>
                        <SelectItem value="19:30:00">19:30</SelectItem>
                        <SelectItem value="20:00:00">20:00</SelectItem>
                        <SelectItem value="20:30:00">20:30</SelectItem>
                        <SelectItem value="21:00:00">21:00</SelectItem>
                        <SelectItem value="21:30:00">21:30</SelectItem>
                        <SelectItem value="22:00:00">22:00</SelectItem>
                        <SelectItem value="22:30:00">22:30</SelectItem>
                        <SelectItem value="23:00:00">23:00</SelectItem>
                        <SelectItem value="23:30:00">23:30</SelectItem>
                      </SelectGroup>
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
              disabled={upsertAppointmentAction.isPending}
              isLoading={upsertAppointmentAction.isPending}
            >
              {appointment?.id ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
