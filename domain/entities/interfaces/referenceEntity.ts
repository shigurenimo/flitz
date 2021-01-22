import { IPostEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IReferenceEntity {
  createdAt: Date
  isRead: boolean
  post: IPostEntity
  postId: Id
  user: IUserEntity
  userId: Id
}
