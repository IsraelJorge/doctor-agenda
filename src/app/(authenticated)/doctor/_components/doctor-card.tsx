'use client'

import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { formatCurrencyInCents } from '@/helpers/currency'
import { DateHelpers } from '@/helpers/date-helpers'

import { UpsertDoctorForm } from './upsert-doctor-form'

export type DoctorCardProps = {
  doctor: {
    id: string
    name: string
    specialty: string
    availableFromWeekDay: number
    availableToWeekDay: number
    availableFromTime: string
    availableToTime: string
    appointmentPriceInCents: number
    avatarImageUrl: string | null
  }
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { from, to } = DateHelpers.getWeekAndTimeAvailability({
    availableFromTime: doctor.availableFromTime,
    availableFromWeekDay: doctor.availableFromWeekDay,
    availableToTime: doctor.availableToTime,
    availableToWeekDay: doctor.availableToWeekDay,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={doctor.avatarImageUrl ?? ''} alt={doctor.name} />
            <AvatarFallback>
              {doctor.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <Badge variant="outline">
              <Icon name="stethoscope" />
              {doctor.specialty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <Icon name="calendar" />
          {from.format('dddd')} a {to.format('dddd')}
        </Badge>
        <Badge variant="outline">
          <Icon name="clock" />
          {from.format('HH:mm')} às {to.format('HH:mm')}
        </Badge>
        <Badge>
          <Icon name="dollar-sign" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={{
              ...doctor,
              availableFromTime: from.format('HH:mm:ss'),
              availableToTime: to.format('HH:mm:ss'),
            }}
            onSuccess={() => setIsOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  )
}
