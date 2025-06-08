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

import { AddPatientButton } from './_components/add-patient-button'
import { columns } from './_components/table-columns'

export default async function PatientPage() {
  const patients = await findPatient()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable data={patients} columns={columns} />
      </PageContent>
    </PageContainer>
  )
}
