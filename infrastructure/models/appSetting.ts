/**
 * 設定
 */
export type AppSetting = {
  fcmToken: string | null
  fcmTokenForMobile: string | null
  isProtected: boolean
  isPublicEmail: boolean
  isEnabledNotificationEmail: boolean
  isEnabledNotificationMessage: boolean
  isEnabledNotificationPostLike: boolean
  isEnabledNotificationPostQuotation: boolean
}
