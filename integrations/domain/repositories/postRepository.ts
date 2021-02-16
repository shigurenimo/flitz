import type { File, Friendship, Like, Post, User } from "db"
import { PostEntity } from "integrations/domain/entities"
import type { Id, PostText } from "integrations/domain/valueObjects"

/**
 * 投稿
 */
export interface IPostRepository {
  /**
   * TODO: 集約
   * @param input
   */
  createPost(input: {
    fileIds: Id[]
    friendships: Friendship[]
    text: PostText
    userId: Id
  }): Promise<{
    post: Post
    postEntity: PostEntity
  }>

  /**
   * TODO: Move to ReplyRepository
   * @deprecated
   * @param input
   */
  createReply(input: {
    friendships: Friendship[]
    postId: Id
    text: PostText
    userId: Id
  }): Promise<{
    post: Post & { replies: Post[] }
    postEntity: PostEntity
  }>

  /**
   * TODO: Move to QuotationRepository
   * @deprecated
   * @param input
   */
  createPostQuotation(input: {
    friendships: Friendship[]
    postId: Id
    userId: Id
  }): Promise<{
    post: Post & { quotations: Post[] }
    postEntity: PostEntity
  }>

  deletePost(input: { postId: Id; userId: Id }): Promise<null>

  /**
   * TODO: Move to PostLikeRepository
   * @deprecated
   * @param input
   */
  createLikes(input: {
    postId: Id
    userId: Id
  }): Promise<{
    post: Post & {
      user: User & { iconImage: File | null }
      likes: Like[]
    }
    postEntity: PostEntity
  }>

  /**
   * TODO: Move to PostLikeRepository
   * @deprecated
   * @param input
   */
  deleteLikes(input: { postId: Id; userId: Id }): Promise<null>
}
