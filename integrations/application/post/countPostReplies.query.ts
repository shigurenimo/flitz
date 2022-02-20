import db from "db"
import { Id } from "integrations/domain"
import { injectable } from "tsyringe"

type Props = {
  replyId: Id
}

@injectable()
export class CountPostRepliesQuery {
  /**
   * 投稿のリプライ数を取得する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    const count = await db.post.count({
      where: { replyId: props.replyId.value },
    })

    return count
  }
}
