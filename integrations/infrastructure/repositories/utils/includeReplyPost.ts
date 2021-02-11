import { Id } from "integrations/domain/valueObjects"

export const includeReplyPost = (userId: Id | null) => {
  return {
    files: true,
    likes: userId ? { where: { userId: userId.value } } : false,
    quotations: userId ? { where: { userId: userId.value } } : false,
    replies: userId ? { where: { userId: userId.value } } : false,
    user: { include: { iconImage: true } },
  }
}
