import {
  IPostEntity,
  IReferenceEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class ReferenceEntity implements IReferenceEntity {
  createdAt!: Date
  isRead!: boolean
  post!: IPostEntity
  postId!: Id
  user!: IUserEntity
  userId!: Id

  constructor(public props: IReferenceEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
