import { Button } from '@/components/ui/button'
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

export default function DoctorPage() {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Icon name="plus" />
            Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  )
}
