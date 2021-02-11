import { File, Like, Post, User } from "db"
import { LikeEntity } from "integrations/domain/entities"
import { EmbededPost } from "integrations/domain/repositories/types/embededPost"
import type { Count, Id, Skip, Take, Username } from "integrations/domain/valueObjects"

/**
 * いいね評価
 */
export interface ILikeRepository {
  countLikes(input: { username: Username }): Promise<Count>

  getLikes(input: {
    userId: Id | null
    skip: Skip
    take: Take
    username: Username
  }): Promise<{
    likes: (Like & {
      post: Post & {
        likes: Like[]
        quotation: EmbededPost | null
        quotations: Post[]
        replies: Post[]
        reply: EmbededPost | null
        user: User & { iconImage: File | null }
      }
    })[]
    likeEntities: LikeEntity[]
  }>
}
