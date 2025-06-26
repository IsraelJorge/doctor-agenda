import { findDoctor } from '@/actions/doctor/find-doctor'
import { EmptyMessage } from '@/components/ui/empty-message'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'

import { AddDoctorButton } from './_components/add-doctor-button'
import { DoctorCard } from './_components/doctor-card'

export default async function DoctorPage() {
  const doctors = await findDoctor()

  const isEmpty = (doctors?.length ?? 0) === 0

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        {isEmpty ? (
          <EmptyMessage
            iconName="stethoscope"
            title="Nenhum médico cadastrado"
            description="Você ainda não possui médicos cadastrados."
          />
        ) : (
          <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </section>
        )}
      </PageContent>
    </PageContainer>
  )
}
