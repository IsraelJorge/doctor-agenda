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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFindAvailableTimes } from '@/data/hooks/use-find-available-times'
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

  const selectedDoctorId = form.watch('doctorId')
  const selectedPatientId = form.watch('patientId')
  const selectedDate = form.watch('date')

  const isDoctorAndPatientSelected = !!selectedDoctorId && !!selectedPatientId

  const { data: availableTimes } = useFindAvailableTimes({
    data: {
      date: selectedDate,
      doctorId: selectedDoctorId,
    },
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

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    )
    if (!selectedDoctor) return false
    const dayOfWeek = date.getDay()
    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor?.availableToWeekDay
    )
  }

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
                      disabled={!selectedDoctorId}
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
                        disabled={!isDoctorAndPatientSelected}
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
                        disabled={(date) =>
                          date < new Date() || !isDateAvailable(date)
                        }
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
                    disabled={!isDoctorAndPatientSelected || !selectedDate}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes?.data?.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          disabled={!time.available}
                        >
                          {time.label} {!time.available && '(Indisponível)'}
                        </SelectItem>
                      ))}
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
