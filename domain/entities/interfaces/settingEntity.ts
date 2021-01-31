import { Setting } from "db"
import { IUserEntity } from "domain/entities/interfaces/userEntity"
import { Email, Id } from "domain/valueObjects"

export interface ISettingEntity
  extends Omit<Setting, "id" | "notificationEmail" | "user" | "userId"> {
  id: Id
  notificationEmail: Email | null
  user: IUserEntity | null
  userId: Id | null
}
