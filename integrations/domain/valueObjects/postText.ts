import * as z from "zod"

export const zPostText = z.string().min(1).max(280)

export type PostTextValue = z.infer<typeof zPostText>

/**
 * 投稿のテキスト
 */
export class PostText {
  constructor(public value: PostTextValue) {
    zPostText.parse(value)
    Object.freeze(this)
  }
}
