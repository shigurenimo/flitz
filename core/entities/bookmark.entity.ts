import { z } from "zod"
import { Id } from "core/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  postId: z.number(),
  userId: z.number(),
})

/**
 * ブックマーク
 */
export class BookmarkEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * ブックマークした投稿のID
   */
  readonly postId!: Id

  /**
   * ブックマークしたユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
