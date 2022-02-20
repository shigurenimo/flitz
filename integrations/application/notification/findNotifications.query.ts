import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  skip: number
}

@injectable()
export class FindNotificationsQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props) {
    const notifications = await db.notification.findMany({
      include: {
        friendship: {
          include: { follower: { include: { iconImage: true } } },
        },
        like: {
          include: {
            post: {
              include: {
                files: true,
                likes: { where: { userId: props.userId.value } },
                quotation: { include: includeEmbededPost(props.userId) },
                quotations: { where: { userId: props.userId.value } },
                replies: { where: { userId: props.userId.value } },
                reply: { include: includeEmbededPost(props.userId) },
              },
            },
            user: { include: { iconImage: true } },
          },
        },
        post: {
          include: {
            files: true,
            likes: { where: { userId: props.userId.value } },
            quotation: { include: includeEmbededPost(props.userId) },
            quotations: { where: { userId: props.userId.value } },
            replies: { where: { userId: props.userId.value } },
            reply: { include: includeEmbededPost(props.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: 16,
      where: { userId: props.userId.value },
    })

    return notifications.map((notification) => {
      return this.queryConverter.toUserNotification(notification)
    })
  }
}
