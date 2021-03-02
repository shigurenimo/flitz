import type { Id } from "integrations/domain/valueObjects"

/**
 * フォロー関係
 */
export class FriendshipEntity {
  /**
   * ID
   */
  id!: Id

  /**
   * フォローされているユーザーのID
   */
  followeeId!: Id

  /**
   * フォローしているユーザーのID
   */
  followerId!: Id

  constructor(public props: Omit<FriendshipEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
