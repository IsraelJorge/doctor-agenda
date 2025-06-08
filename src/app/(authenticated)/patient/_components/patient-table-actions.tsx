'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'

import { Patient } from './table-columns'
import { UpsertPatientForm } from './upsert-patient-form'

type PatientTableActionsProps = {
  patient: Patient
}

export function PatientTableActions({ patient }: PatientTableActionsProps) {
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon name="more-vertical" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpenDialog(true)}>
            <Icon name="edit" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icon name="trash-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        patient={patient}
        onSuccess={() => {
          setIsOpenDialog(false)
        }}
      />
    </Dialog>
  )
}
