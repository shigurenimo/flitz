import SuperJson from "superjson"

export class CancelledError extends Error {
  readonly name = "CancelledError"

  readonly code = "CANCELLED"

  constructor(message = "内部サーバーエラー。") {
    super()
    this.message = message
  }
}

SuperJson.registerClass(CancelledError)

SuperJson.allowErrorProps("message")
