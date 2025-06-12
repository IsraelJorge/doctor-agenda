import { redirect } from 'next/navigation'

import { findDashboard } from '@/actions/find-dashboard'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'
import { DateHelpers } from '@/helpers/date-helpers'
import { Route } from '@/utils/routes'

import { DatePicker } from './_components/date-picker'
import { StatsCards } from './_components/stats-cards'

interface DashboardPageProps {
  searchParams: Promise<{
    from: string
    to: string
  }>
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { from, to } = await searchParams

  if (!from || !to) {
    redirect(
      `${Route.dashboard}?from=${DateHelpers.getInstanceDayjs().format('YYYY-MM-DD')}&to=${DateHelpers.getInstanceDayjs()
        .add(1, 'month')
        .format('YYYY-MM-DD')}`,
    )
  }

  const { totalRevenue, totalAppointments, totalPatients, totalDoctors } =
    await findDashboard({
      from,
      to,
    })

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Sistema completo para gestão de clínicas, com controle de pacientes,
            agendamentos e equipe médica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
      </PageContent>
    </PageContainer>
  )
}
