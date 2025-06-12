'use client'

import { ColumnDef } from '@tanstack/react-table'

import { appointmentTable } from '@/database/schemas'
import { DateHelpers } from '@/helpers/date-helpers'

import { AppointmentTableActions } from './appointment-table-actions'

export type Appointment = typeof appointmentTable.$inferSelect & {
  patient: {
    name: string
  }
  doctor: {
    name: string
    specialty: string
  }
}

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'patient.name',
    header: 'Paciente',
    cell: (info) => info.row.original.patient?.name,
  },
  {
    accessorKey: 'doctor.name',
    header: 'Médico',
    cell: (info) => info.row.original.doctor?.name,
  },
  {
    accessorKey: 'date',
    header: 'Data/Hora',
    cell: (info) => DateHelpers.formatDateWithTime(info.row.original.date),
  },
  {
    accessorKey: 'doctor.specialty',
    header: 'Especialidade',
    cell: (info) => info.row.original.doctor?.specialty,
  },
  {
    accessorKey: 'appointmentPriceInCents',
    header: 'Valor',
    cell: (info) =>
      `R$ ${(info.row.original.appointmentPriceInCents / 100).toFixed(2)}`,
  },
  {
    id: 'actions',
    cell: (info) => {
      return <AppointmentTableActions appointment={info.row.original} />
    },
  },
]
