'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon'

import { UpsertDoctorForm } from './upsert-doctor-form'

export function AddDoctorButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm onSuccess={() => setIsOpen(false)} />
    </Dialog>
  )
}
