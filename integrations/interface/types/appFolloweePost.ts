import { AppPost } from "integrations/interface/types/appPost"

/**
 * フォローしているユーザのポスト
 */
export type AppFolloweePost = AppPost & {
  /**
   * 既読済みかどうか
   */
  isRead: boolean
}
