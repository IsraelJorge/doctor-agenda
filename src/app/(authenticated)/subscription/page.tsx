import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'
import { getUserSession } from '@/lib/auth'

import { SubscriptionPlan } from './_components/subscription-plan'

export default async function SubscriptionPage() {
  const session = await getUserSession()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Planos</PageTitle>
          <PageDescription>Gerencie seu plano.</PageDescription>
        </PageHeaderContent>
      </PageHeader>

      <PageContent>
        <SubscriptionPlan
          className="w-[350px]"
          active={session?.user?.plan === 'essential'}
          userEmail={session?.user.email}
        />
      </PageContent>
    </PageContainer>
  )
}
