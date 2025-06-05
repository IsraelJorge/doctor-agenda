import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/icon'

import { UpsertDoctorForm } from './upsert-doctor-form'

export function AddDoctorButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm />
    </Dialog>
  )
}
