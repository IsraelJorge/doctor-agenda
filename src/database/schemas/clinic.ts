import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { appointmentTable } from './appointment'
import { doctorTable } from './doctor'
import { patientTable } from './patient'
import { usersToClinicsTable } from './users-to-clinics'

export const clinicTable = pgTable('clinic', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const clinicRelations = relations(clinicTable, ({ many }) => ({
  doctors: many(doctorTable),
  patients: many(patientTable),
  appointments: many(appointmentTable),
  usersToClinics: many(usersToClinicsTable),
}))
