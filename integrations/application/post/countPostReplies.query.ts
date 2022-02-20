import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
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
    try {
      const count = await db.post.count({
        where: { replyId: props.replyId.value },
      })

      return count
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
