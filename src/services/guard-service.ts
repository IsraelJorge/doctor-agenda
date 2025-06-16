import { ErrorUtils } from '@/data/erros'
import { getUserSession } from '@/lib/auth'
import { Session, SessionWithClinic } from '@/lib/auth/types'

type GetValidatedSession = {
  (options: { requireClinic: true }): Promise<SessionWithClinic>
  (options?: { requireClinic?: false }): Promise<Session>
  (options?: { requireClinic?: boolean }): Promise<Session | SessionWithClinic>
}

export const GuardService: {
  getValidatedSession: GetValidatedSession
} = {
  // @ts-expect-error
  async getValidatedSession(options?: { requireClinic?: boolean }) {
    const session = await getUserSession()
    if (!session) {
      return ErrorUtils.unauthorized()
    }

    if (options?.requireClinic && !session.user.clinic?.id) {
      return ErrorUtils.missingClinic()
    }

    return session
  },
}
