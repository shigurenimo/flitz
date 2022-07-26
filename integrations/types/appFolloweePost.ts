import { AppPost } from "integrations/types/appPost"

/**
 * フォローしているユーザのポスト
 */
export type AppFolloweePost = AppPost & {
  /**
   * 既読済みかどうか
   */
  isRead: boolean
}
