import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { clinicTable } from './clinic'
import { doctorTable } from './doctor'
import { patientTable } from './patient'

export const appointmentTable = pgTable('appointment', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicTable.id, { onDelete: 'cascade' }),
  doctorId: uuid('doctor_id')
    .notNull()
    .references(() => doctorTable.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patientTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const appointmentRelations = relations(appointmentTable, ({ one }) => ({
  clinic: one(clinicTable, {
    fields: [appointmentTable.clinicId],
    references: [clinicTable.id],
  }),
  doctor: one(doctorTable, {
    fields: [appointmentTable.doctorId],
    references: [doctorTable.id],
  }),
  patient: one(patientTable, {
    fields: [appointmentTable.patientId],
    references: [patientTable.id],
  }),
}))
