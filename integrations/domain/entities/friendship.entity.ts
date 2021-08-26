import type { Id } from "integrations/domain/valueObjects"

/**
 * フォロー関係
 */
export class FriendshipEntity {
  /**
   * ID
   */
  readonly id!: Id

  /**
   * フォローされているユーザーのID
   */
  readonly followeeId!: Id

  /**
   * フォローしているユーザーのID
   */
  readonly followerId!: Id

  constructor(public props: Omit<FriendshipEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
