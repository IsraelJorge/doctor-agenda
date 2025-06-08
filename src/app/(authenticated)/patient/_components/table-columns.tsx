'use client'

import { ColumnDef } from '@tanstack/react-table'

import { patientTable } from '@/database/schemas/patient'

import { PatientTableActions } from './patient-table-actions'

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
      return <PatientTableActions patient={info.cell.row.original} />
    },
  },
]
