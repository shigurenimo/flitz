import type { File, Like, Post, Reference } from "db"
import type { ReferenceEntity } from "integrations/domain/entities"
import type { EmbededPost, UserWithIcon } from "integrations/domain/repositories/types"
import type { Count, Id, Skip } from "integrations/domain/valueObjects"

/**
 * タイムライン
 */
export interface IReferenceRepository {
  countReferences(input: { userId: Id }): Promise<Count>

  hasUnreadReference(input: { userId: Id }): Promise<boolean>

  findReferences(input: {
    skip: Skip
    userId: Id
  }): Promise<{
    references: (Reference & {
      post: Post & {
        files: File[]
        likes: Like[]
        quotation: EmbededPost | null
        quotations: Post[]
        replies: Post[]
        reply: EmbededPost | null
        user: UserWithIcon
      }
    })[]
    referenceEntities: ReferenceEntity[]
  }>

  markReferencesAsRead(input: { userId: Id }): Promise<null>
}
