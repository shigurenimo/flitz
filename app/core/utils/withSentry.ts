import {
  configureScope,
  init,
  Integrations,
  setContext,
  setUser,
  startTransaction,
} from "@sentry/node"
import "@sentry/tracing"
import { Ctx } from "blitz"
import { InternalError } from "integrations/errors"

type Resolver<T, U> = (t: T, ctx: Ctx) => PromiseLike<U>

export const withSentry = <T, U>(resolver: Resolver<T, U>, name: string) => {
  return async (props: T, ctx: Ctx) => {
    try {
      init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        attachStacktrace: true,
        normalizeDepth: 5,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
        integrations: [new Integrations.Http({ tracing: true })],
        release: process.env.SENTRY_RELEASE,
        debug: false,
        beforeSend(event) {
          if (process.env.NODE_ENV === "production") {
            return null
          }
          return event
        },
      })

      setUser({ user: { id: ctx.session?.userId } })

      setContext("props", props)

      const transaction = startTransaction({ op: "function", name })

      configureScope((scope) => {
        scope.setSpan(transaction)
      })

      const result = await resolver(props, ctx)

      transaction.finish()

      return result
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new InternalError()
    }
  }
}
