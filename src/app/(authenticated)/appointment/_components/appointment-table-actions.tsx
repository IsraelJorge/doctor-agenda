'use client'

import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteAppointment } from '@/actions/appointment/delete-appointment'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'

import { Appointment } from './table-columns'

export type AppointmentTableActionsProps = {
  appointment: Appointment
}

export function AppointmentTableActions({
  appointment,
}: AppointmentTableActionsProps) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success('Agendamento excluído com sucesso!')
      setIsOpenDeleteDialog(false)
    },
    onError: () => {
      toast.error('Ocorreu um erro ao excluir o agendamento.')
    },
  })

  const handleDeleteAppointment = () => {
    deleteAppointmentAction.execute({ id: appointment.id })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon name="more-vertical" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{appointment.patient?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)}>
            <Icon name="trash-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja excluir este agendamento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não poderá ser desfeita. Isso irá excluir o agendamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={deleteAppointmentAction.isPending}
                isLoading={deleteAppointmentAction.isPending}
                onClick={handleDeleteAppointment}
              >
                Confirmar
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
