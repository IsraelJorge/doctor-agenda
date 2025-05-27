import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

import { appointmentTable } from './appointment'
import { clinicTable } from './clinic'

export const doctorTable = pgTable('doctor', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  avatarImageUrl: text('avatar_image_url'),
  specialty: text('specialty').notNull(),
  // 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday
  availableFromWeekday: integer('available_from_weekday').notNull(),
  availableToWeekday: integer('available_to_weekday').notNull(),
  availableFromTime: time('available_from_time').notNull(),
  availableToTime: time('available_to_time').notNull(),
  appointmentPriceInCents: integer('appointment_price_in_cents').notNull(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const doctorRelations = relations(doctorTable, ({ one, many }) => ({
  clinic: one(clinicTable, {
    fields: [doctorTable.clinicId],
    references: [clinicTable.id],
  }),
  appointments: many(appointmentTable),
}))
