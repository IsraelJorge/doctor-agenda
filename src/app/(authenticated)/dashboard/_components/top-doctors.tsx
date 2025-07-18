import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { EmptyAlert } from '@/components/ui/empty-alert'
import { Icon } from '@/components/ui/icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface TopDoctorsProps {
  doctors: {
    id: string
    name: string
    avatarImageUrl: string | null
    specialty: string
    appointments: number
  }[]
}

export function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="stethoscope" className="text-muted-foreground" />
            <CardTitle className="text-base">Médicos</CardTitle>
          </div>
        </div>
        <Separator className="my-4" />
        <ScrollArea className="h-[230px] @min-[1265px]/main:h-full">
          <div className="space-y-6">
            {doctors.length === 0 && (
              <EmptyAlert
                title="Nenhum médico cadastrado"
                description="Você ainda não possui médicos cadastrados."
              />
            )}
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                      {doctor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm">{doctor.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm font-medium">
                    {doctor.appointments} agend.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
