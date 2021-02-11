import type { File, Friendship, Like, Post, User } from "db"
import { PostEntity } from "integrations/domain/entities"
import { FeedPost, UserWithIcon } from "integrations/domain/repositories/types"
import type {
  Count,
  Id,
  PostText,
  Skip,
  Take,
  Username,
} from "integrations/domain/valueObjects"

/**
 * 投稿
 */
export interface IPostRepository {
  countReplies(input: { replyId: Id }): Promise<Count>

  countPosts(): Promise<Count>

  countUserPosts(input: { username: Username }): Promise<Count>

  countUserReplies(input: { username: Username }): Promise<Count>

  createPost(input: {
    fileIds: Id[]
    friendships: Friendship[]
    text: PostText
    userId: Id
  }): Promise<{
    post: Post
    postEntity: PostEntity
  }>

  createReply(input: {
    friendships: Friendship[]
    postId: Id
    text: PostText
    userId: Id
  }): Promise<{
    post: Post & { replies: Post[] }
    postEntity: PostEntity
  }>

  createPostQuotation(input: {
    friendships: Friendship[]
    postId: Id
    userId: Id
  }): Promise<{
    post: Post & { quotations: Post[] }
    postEntity: PostEntity
  }>

  deletePost(input: { postId: Id; userId: Id }): Promise<null>

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

  deleteLikes(input: { postId: Id; userId: Id }): Promise<null>

  getReplies(input: {
    skip: Skip
    take: Take
    replyId: Id
    userId: Id | null
  }): Promise<{
    posts: FeedPost[]
    postEntities: PostEntity[]
  }>

  getRepliesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<{
    posts: (Post & {
      files: File[]
      likes: Like[]
      quotation: FeedPost | null
      quotations: Post[]
      replies: Post[]
      reply: FeedPost | null
      user: UserWithIcon
    })[]
    postEntities: PostEntity[]
  }>

  getPostsByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<{
    posts: (Post & {
      files: File[]
      likes: Like[]
      quotation: FeedPost | null
      quotations: Post[]
      replies: Post[]
      reply: FeedPost | null
      user: UserWithIcon
    })[]
    postEntities: PostEntity[]
  }>

  getNewPosts(input: {
    skip: Skip
    userId: Id | null
  }): Promise<{
    posts: (Post & {
      files: File[]
      likes: Like[]
      quotation: FeedPost | null
      quotations: Post[]
      replies: Post[]
      reply: FeedPost | null
      user: UserWithIcon
    })[]
    postEntities: PostEntity[]
  }>

  getPost(input: {
    id: Id
  }): Promise<{
    post:
      | (Post & {
          files: File[]
          user: UserWithIcon
        })
      | null
    postEntity: PostEntity | null
  }>
}
