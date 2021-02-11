import * as z from "zod"

export const postTextSchema = z.string().min(1).max(280)

export type PostTextValue = z.infer<typeof postTextSchema>

/**
 * 投稿のテキスト
 */
export class PostText {
  constructor(public value: PostTextValue) {
    postTextSchema.parse(value)
    Object.freeze(this)
  }
}
