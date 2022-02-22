/**
 * フォロー関係
 */
export type AppFriendship = {
  id: string
  createdAt: Date
  userId: string
  username: string | null
  name: string | null
  biography: string
  /**
   * 自分がフォローされているかどうか
   */
  isFollowee: boolean
  /**
   * 自分がフォローしているかどうか
   */
  isFollower: boolean
}
