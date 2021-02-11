import { File, Like, Post, User } from "db"

export type EmbededPost = Post & {
  likes: Like[]
  quotations: Post[]
  replies: Post[]
  user: User & { iconImage: File | null }
}
