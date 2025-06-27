'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Icon } from '@/components/ui/icon'
import { DateHelpers } from '@/helpers/date-helpers'

const chartConfig = {
  doctor: {
    label: 'Médicos',
    color: 'var(--chart-1)',
  },
  patient: {
    label: 'Pacientes',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type PatientDoctorGrowthChartProps = {
  doctorsAndPatientsByMonth: {
    month: string
    doctor: number
    patient: number
  }[]
}

export function PatientDoctorGrowthChart({
  doctorsAndPatientsByMonth,
}: PatientDoctorGrowthChartProps) {
  // Gerar um array com 6 messes percorridos
  const chartMoths = Array.from({ length: 6 })
    .map((_, i) => DateHelpers.getInstanceDayjs().subtract(i, 'month'))
    .reverse()

  const chartData = chartMoths.map((month) => {
    const dataForMonth = doctorsAndPatientsByMonth.find(
      (item) =>
        DateHelpers.getInstanceDayjs(item.month).format('MMM') ===
        month.format('MMM'),
    )
    return {
      month: month.format('MMM'),
      doctor: dataForMonth?.doctor ? Number(dataForMonth.doctor) : 0,
      patient: dataForMonth?.patient ? Number(dataForMonth.patient) : 0,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <Icon name="activity" />
          Pacientes X Médicos
        </CardTitle>
        <CardDescription>{`${chartMoths[0].format('MMMM')} - ${chartMoths[chartData.length - 1].format('MMMM')} ${DateHelpers.getInstanceDayjs().format('YYYY')}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="doctor"
              type="monotone"
              stroke="var(--color-doctor)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="patient"
              type="monotone"
              stroke="var(--color-patient)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
