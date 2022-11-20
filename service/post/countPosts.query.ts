import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { InternalError } from "infrastructure/errors"

@injectable()
export class CountPostsQuery {
  /**
   * 投稿数を取得する
   * @returns
   */
  async execute() {
    try {
      const count = await db.post.count({})

      return count
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
