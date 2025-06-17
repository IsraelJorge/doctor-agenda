type MonthCount = { month: string; total: number }

export function mergeDoctorsAndPatientsByMonth(
  doctorsByMonth: MonthCount[],
  patientsByMonth: MonthCount[],
): { month: string; doctor: number; patient: number }[] {
  const allMonths = Array.from(
    new Set([
      ...doctorsByMonth.map((d) => d.month),
      ...patientsByMonth.map((p) => p.month),
    ]),
  )
  return allMonths.map((month) => {
    const doctor = doctorsByMonth.find((d) => d.month === month)?.total ?? 0
    const patient = patientsByMonth.find((p) => p.month === month)?.total ?? 0
    return { month, doctor, patient }
  })
}
