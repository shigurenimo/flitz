import { File } from "db"
import { FileEntity, PostEntity, UserEntity } from "domain/entities"
import { FileType, Id, Path, Service } from "domain/valueObjects"

type FileRelation = {
  post?: PostEntity
  user?: UserEntity
}

export class FileEntityFactory {
  static fromFile(data: File & FileRelation) {
    return new FileEntity({
      createdAt: data.createdAt,
      id: new Id(data.id),
      path: new Path(data.path),
      post: data.post ? data.post : null,
      postId: data.postId ? new Id(data.postId) : null,
      service: data.service ? new Service(data.service) : null,
      type: new FileType(data.type),
      user: data.user ? new UserEntity(data.user) : null,
      userId: new Id(data.userId),
    })
  }
}
