import type { UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

export class SessionEntity {
  antiCSRFToken!: string | null
  createdAt!: Date
  expiresAt!: Date | null
  handle!: string
  hashedSessionToken!: string | null
  id!: Id
  privateData!: string | null
  publicData!: string | null
  updatedAt!: Date
  user!: UserEntity | null
  userId!: Id | null

  constructor(public props: Omit<SessionEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
