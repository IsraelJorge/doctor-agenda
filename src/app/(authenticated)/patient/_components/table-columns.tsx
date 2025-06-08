'use client'

import { ColumnDef } from '@tanstack/react-table'

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
import { patientTable } from '@/database/schemas/patient'

export type Patient = typeof patientTable.$inferSelect

const sex: Record<Patient['sex'], string> = {
  male: 'Masculino',
  female: 'Feminino',
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Número de telefone',
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: (info) => sex[info.cell.row.original.sex],
  },
  {
    id: 'actions',
    cell: (info) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icon name="more-vertical" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{info.cell.row.original.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon name="edit" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="trash-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
