'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon'

import { UpsertPatientForm } from './upsert-patient-form'

export function AddPatientButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" />
          Adicionar Paciente
        </Button>
      </DialogTrigger>
      <UpsertPatientForm onSuccess={() => setOpen(false)} />
    </Dialog>
  )
}
