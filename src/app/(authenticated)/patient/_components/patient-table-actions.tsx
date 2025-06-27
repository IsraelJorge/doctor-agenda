'use client'

import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deletePatient } from '@/actions/patient/delete-patient'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success('Paciente excluído com sucesso!')
      setIsOpenDeleteDialog(false)
      setIsOpenDialog(false)
    },
    onError: () => {
      toast.error('Ocorreu um erro ao excluir o paciente.')
    },
  })

  const handleDeletePatient = () => {
    deletePatientAction.execute({ id: patient.id })
  }

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
          <AlertDialog
            open={isOpenDeleteDialog}
            onOpenChange={setIsOpenDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsOpenDeleteDialog(true)}
              >
                <Icon name="trash-2" />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir este paciente?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não poderá ser desfeita. Isso irá excluir o paciente
                  e todos os dados relacionados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    disabled={deletePatientAction.isPending}
                    isLoading={deletePatientAction.isPending}
                    onClick={handleDeletePatient}
                  >
                    Confirmar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
