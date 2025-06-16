import { redirect } from 'next/navigation'

import { findDashboard } from '@/actions/dashboard/find-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Icon } from '@/components/ui/icon'
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

import { appointmentsTableColumns } from '../appointment/_components/table-columns'
import { AppointmentsChart } from './_components/appointments-chart'
import { DatePicker } from './_components/date-picker'
import { StatsCards } from './_components/stats-cards'
import { TopDoctors } from './_components/top-doctors'
import TopSpecialties from './_components/top-specialties'

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

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    dailyAppointmentsData,
    topDoctors,
    topSpecialties,
    todayAppointments,
  } = await findDashboard({
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
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon name="calendar" className="text-muted-foreground" />

                <CardTitle className="text-base">
                  Agendamentos de hoje
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={appointmentsTableColumns}
                data={todayAppointments}
              />
            </CardContent>
          </Card>
          <TopSpecialties topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  )
}
