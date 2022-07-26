import { z } from "zod"
import { Id } from "integrations/domain/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  postId: z.instanceof(Id),
  userId: z.instanceof(Id),
})

/**
 * 投稿に対するイイネ
 */
export class LikeEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 投稿のID
   */
  readonly postId!: Id

  /**
   * いいねしたユーザーのID
   */
  readonly userId!: Id

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
