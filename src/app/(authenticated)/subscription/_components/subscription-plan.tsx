'use client'

import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { createStripeCheckout } from '@/actions/stripe/create-stripe-checkout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { useStripe } from '@/hooks/use-stripe'

interface SubscriptionPlanProps {
  active?: boolean
  className?: string
  userEmail?: string
}

export function SubscriptionPlan({
  active = false,
  className,
  userEmail,
}: SubscriptionPlanProps) {
  const router = useRouter()

  const { redirectStripeCheckout } = useStripe()

  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!data?.sessionId) throw new Error('Session ID not found')

      await redirectStripeCheckout({ sessionId: data.sessionId })
    },
    onError: () => {
      toast.error('Erro ao fazer assinatura')
    },
  })
  const features = [
    'Cadastro de até 3 médicos',
    'Agendamentos ilimitados',
    'Métricas básicas',
    'Cadastro de pacientes',
    'Confirmação manual',
    'Suporte via e-mail',
  ]

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute()
  }

  const handleManagePlanClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`,
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-2xl font-bold">Essential</h3>
          {active && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Para profissionais autônomos ou pequenas clínicas
        </p>
        <div className="flex items-baseline">
          <span className="text-foreground text-3xl font-bold">R$59</span>
          <span className="text-foreground ml-1">/ mês</span>
        </div>
      </CardHeader>

      <CardContent>
        <Separator />

        <div className="space-y-4 pt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <Icon
                  name="check-circle-2"
                  className="h-5 w-5 text-green-500"
                />
              </div>
              <p className="text-muted-foreground ml-3">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="w-full"
            variant="outline"
            onClick={active ? handleManagePlanClick : handleSubscribeClick}
            disabled={createStripeCheckoutAction.isExecuting}
          >
            {createStripeCheckoutAction.isExecuting ? (
              <Icon name="loader-2" className="mr-1 h-4 w-4 animate-spin" />
            ) : active ? (
              'Gerenciar assinatura'
            ) : (
              'Fazer assinatura'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
