import { Injectable } from "@nestjs/common"
import db from "db"
import { Id, Username } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"

@Injectable()
export class UserQuery {
  constructor(private queryConverter: QueryConverter) {}

  /**
   * @param userId
   */
  async find(userId: Id) {
    const user = await db.user.findUnique({
      include: {
        followers: userId ? { where: { followerId: userId.value } } : false,
        headerImage: true,
        iconImage: true,
      },
      where: { id: userId.value },
    })

    if (user === null) {
      return null
    }

    return this.queryConverter.toProfile(user)
  }

  async findByUsername(username: Username, userId: Id | null) {
    const user = await db.user.findUnique({
      include: {
        followers: userId ? { where: { followerId: userId.value } } : false,
        headerImage: true,
        iconImage: true,
      },
      where: { username: username.value },
    })

    if (user === null) {
      return null
    }

    return this.queryConverter.toProfile(user)
  }
}
