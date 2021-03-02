export type QueryPost = {
  id: string
  createdAt: Date
  fileIds: string[]
  likesCount: number
  quotationsCount: number
  repliesCount: number
  hasLike: boolean
  hasQuotation: boolean
  hasReply: boolean
  text: string | null
}
