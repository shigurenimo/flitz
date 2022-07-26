import { z } from "zod"
import { Id, PostText } from "integrations/domain/valueObjects"

const zProps = z.object({
  id: z.instanceof(Id),
  quotationId: z.instanceof(Id).nullable(),
  quotationsCount: z.number(),
  repliesCount: z.number(),
  replyId: z.instanceof(Id).nullable(),
  text: z.instanceof(PostText).nullable(),
  userId: z.instanceof(Id),
  fileIds: z.array(z.instanceof(Id)),
  followerIds: z.array(z.instanceof(Id)),
})

/**
 * 投稿
 */
export class PostEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * 引用のID
   */
  readonly quotationId!: Id | null

  /**
   * 引用された回数
   */
  readonly quotationsCount!: number

  /**
   * 返信された回数
   */
  readonly repliesCount!: number

  /**
   * 返信先のID
   */
  readonly replyId!: Id | null

  /**
   * 文章
   */
  readonly text!: PostText | null

  /**
   * 作成したユーザーのID
   */
  readonly userId!: Id

  /**
   * 関連付けされたファイルのID
   */
  readonly fileIds!: Id[]

  /**
   * 関連するフィード
   *
   * referencesに変更する
   *
   * @deprecated
   */
  readonly followerIds!: Id[]

  constructor(public props: z.infer<typeof zProps>) {
    zProps.parse(props)
    Object.assign(this, props)
    Object.freeze(this)
  }
}
