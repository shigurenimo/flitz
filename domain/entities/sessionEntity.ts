import { ISessionEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class SessionEntity implements ISessionEntity {
  antiCSRFToken!: string | null
  createdAt!: Date
  expiresAt!: Date | null
  handle!: string
  hashedSessionToken!: string | null
  id!: Id
  privateData!: string | null
  publicData!: string | null
  updatedAt!: Date
  user!: IUserEntity | null
  userId!: string

  constructor(public props: ISessionEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
