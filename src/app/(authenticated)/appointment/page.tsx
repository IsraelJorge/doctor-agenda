import { findDoctor } from '@/actions/find-doctor'
import { findPatient } from '@/actions/find-patient'
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

export default async function AppointmentPage() {
  const [patients, doctors] = await Promise.all([findPatient(), findDoctor()])

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
      <PageContent />
    </PageContainer>
  )
}
