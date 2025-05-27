import { relations } from 'drizzle-orm'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

import { usersToClinicsTable } from './users-to-clinics'

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
})

export const userRelations = relations(userTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}))
