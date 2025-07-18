'use client'

import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'

dayjs.locale('pt-br')
import { DollarSign } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatCurrencyInCents } from '@/helpers/currency'
import { DateHelpers } from '@/helpers/date-helpers'

type DailyAppointment = {
  date: string
  appointments: number
  revenue: number | null
}

type AppointmentsChartProps = {
  dailyAppointmentsData: DailyAppointment[]
}

export const AppointmentsChart = ({
  dailyAppointmentsData,
}: AppointmentsChartProps) => {
  // Gerar 21 dias: 10 antes + hoje + 10 depois
  const chartDays = Array.from({ length: 21 }).map((_, i) =>
    DateHelpers.getInstanceDayjs()
      .subtract(10 - i, 'days')
      .format('YYYY-MM-DD'),
  )

  const chartData = chartDays.map((date) => {
    const dataForDay = dailyAppointmentsData.find((item) => item.date === date)
    return {
      date: DateHelpers.format({
        date,
        format: 'DD/MM',
      }),
      fullDate: date,
      appointments: dataForDay?.appointments || 0,
      revenue: Number(dataForDay?.revenue || 0),
    }
  })

  const chartConfig = {
    appointments: {
      label: 'Agendamentos',
      color: '#0B68F7',
    },
    revenue: {
      label: 'Faturamento',
      color: '#10B981',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <DollarSign />
        <CardTitle>Agendamentos e Faturamento</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ChartContainer config={chartConfig} className="h-full">
          <AreaChart data={chartData} margin={{ right: 36.8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return (
                        <>
                          <div className="h-3 w-3 rounded bg-[#10B981]" />
                          <span className="text-muted-foreground">
                            Faturamento:
                          </span>
                          <span className="font-semibold">
                            {formatCurrencyInCents(Number(value))}
                          </span>
                        </>
                      )
                    }
                    return (
                      <>
                        <div className="h-3 w-3 rounded bg-[#0B68F7]" />
                        <span className="text-muted-foreground">
                          Agendamentos:
                        </span>
                        <span className="font-semibold">{value}</span>
                      </>
                    )
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return DateHelpers.format({
                        date: payload[0].payload?.fullDate,
                        format: 'DD/MM/YYYY (dddd)',
                      })
                    }
                    return label
                  }}
                />
              }
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              fill="var(--color-appointments)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
