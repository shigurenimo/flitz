import { File, Like, Post, User } from "db"

export type FeedPost = Post & {
  files: File[]
  likes: Like[]
  quotations: Post[]
  replies: Post[]
  user: User & { iconImage: File | null }
}
