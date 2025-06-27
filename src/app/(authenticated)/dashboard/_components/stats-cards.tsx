import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon, IconProps } from '@/components/ui/icon'
import { formatCurrencyInCents } from '@/helpers/currency'

type StatsCardsProps = {
  totalRevenue: number | null
  totalAppointments: number
  totalPatients: number
  totalDoctors: number
}

type StatCard = {
  title: string
  value: string
  icon: IconProps['name']
}

export const StatsCards = ({
  totalRevenue,
  totalAppointments,
  totalPatients,
  totalDoctors,
}: StatsCardsProps) => {
  const stats: StatCard[] = [
    {
      title: 'Faturamento',
      value: totalRevenue ? formatCurrencyInCents(totalRevenue) : 'R$ 0,00',
      icon: 'dollar-sign',
    },
    {
      title: 'Agendamentos',
      value: totalAppointments.toString(),
      icon: 'calendar',
    },
    {
      title: 'Pacientes',
      value: totalPatients.toString(),
      icon: 'user',
    },
    {
      title: 'Médicos',
      value: totalDoctors.toString(),
      icon: 'users',
    },
  ]

  return (
    <div className="flex w-full flex-wrap gap-4">
      {stats.map((stat) => {
        return (
          <Card key={stat.title} className="w-full flex-1 basis-[250px] gap-2">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <Icon name={stat.icon} className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
