import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { appointmentTable } from './appointment'
import { clinicTable } from './clinic'

export const patientSexEnum = pgEnum('patient_sex', ['male', 'female'])

export const patientTable = pgTable('patient', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phoneNumber: text('phone_number').notNull(),
  sex: patientSexEnum('sex').notNull(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const patientRelations = relations(patientTable, ({ one, many }) => ({
  clinic: one(clinicTable, {
    fields: [patientTable.clinicId],
    references: [clinicTable.id],
  }),
  appointments: many(appointmentTable),
}))
