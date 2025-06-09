'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon'
import { doctorTable, patientTable } from '@/database/schemas'

import { UpsertAppointmentForm } from './upsert-appointment-form'

export type AddAppointmentButtonProps = {
  patients: (typeof patientTable.$inferSelect)[]
  doctors: (typeof doctorTable.$inferSelect)[]
}

export function AddAppointmentButton({
  patients,
  doctors,
}: AddAppointmentButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <UpsertAppointmentForm
        patients={patients}
        doctors={doctors}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  )
}
