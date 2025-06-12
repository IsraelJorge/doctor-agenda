import { findAppointment } from '@/actions/find-appointment'
import { findDoctor } from '@/actions/find-doctor'
import { findPatient } from '@/actions/find-patient'
import { DataTable } from '@/components/ui/data-table'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'

import { AddAppointmentButton } from './_components/add-appointment-button'
import { appointmentsTableColumns } from './_components/table-columns'

export default async function AppointmentPage() {
  const [patients, doctors, appointments] = await Promise.all([
    findPatient(),
    findDoctor(),
    findAppointment(),
  ])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  )
}
