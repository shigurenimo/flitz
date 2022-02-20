import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  relatedUserId: Id
  skip: number
  userId: Id
}

@injectable()
export class FindUserMessagesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    const messages = await db.message.findMany({
      include: {
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: 20,
      where: {
        exchanges: {
          some: { userId: props.userId.value },
        },
      },
    })

    return messages.map((message) => {
      return this.queryConverter.toUserMessage(message)
    })
  }
}
