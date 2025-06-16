import { auth } from '.'

type RawSession = ReturnType<(typeof auth)['api']['getSession']>
export type Session = NonNullable<Awaited<RawSession>>

export type User = NonNullable<Session>['user']
export type Clinic = NonNullable<User['clinic']>

export type UserWithClinic = User & {
  clinic: Clinic
}

export type SessionWithClinic = Omit<Session, 'user'> & {
  user: UserWithClinic
}
