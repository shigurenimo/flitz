import { captureException } from "@sentry/node"

export const throwError = <T extends Error>(
  error: unknown,
  ErrorClass?: new () => T
) => {
  console.error(error)
  captureException(error)
  if (typeof ErrorClass !== "undefined") {
    return new ErrorClass()
  }
  if (error instanceof Error) {
    return error
  }
  return new Error()
}
