import SuperJson from "superjson"

/**
 * https://blitzjs.com/docs/error-handling#custom-errors
 * https://cloud.google.com/apis/design/errors?hl=ja
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 */
export class InternalError extends Error {
  readonly name = "InternalError"

  readonly code = "INTERNAL"

  constructor(message = "内部サーバーエラー") {
    super()
    this.message = message
  }
}

SuperJson.registerClass(InternalError)

SuperJson.allowErrorProps("message")
