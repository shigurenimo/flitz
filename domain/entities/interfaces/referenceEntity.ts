import { IPostEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IReferenceEntity {
  createdAt: Date
  isRead: boolean
  post: IPostEntity | null
  postId: Id
  user: IUserEntity | null
  userId: Id
}
