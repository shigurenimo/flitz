import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class CheckExchangesQuery {
  async execute(props: Props) {
    try {
      const exchange = await db.exchange.findFirst({
        where: {
          messages: {
            some: {
              isRead: false,
              userId: { not: props.userId.value },
            },
          },
          userId: props.userId.value,
        },
      })

      return exchange !== null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
