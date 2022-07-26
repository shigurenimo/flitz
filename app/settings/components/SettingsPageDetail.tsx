import { Stack, useToast } from "@chakra-ui/react"
import { useMutation, useQuery } from "blitz"
import { getMessaging, getToken, isSupported } from "firebase/messaging"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SettingsPageNotification } from "app/settings/components/SettingsPageNotification"
import testNotification from "app/settings/mutations/testNotification"
import updateSetting from "app/settings/mutations/updateSetting"
import getSetting from "app/settings/queries/getSetting"

export const SettingsPageDetail: FC = () => {
  const { t } = useTranslation()

  const [setting, { setQueryData }] = useQuery(getSetting, null, {
    refetchInterval: false,
  })

  const [
    testNotificationMutation,
    { isLoading: isLoadingTestNotificationMutation },
  ] = useMutation(testNotification)

  const [updateSettingMutation, { isLoading: isLoadingUpdateSettingMutation }] =
    useMutation(updateSetting)

  const messaging = getMessaging()

  const toast = useToast()

  const onSendTestNotification = async () => {
    try {
      await testNotificationMutation()
    } catch (error) {
      toast({
        status: "error",
        title: t`Failed to send a test notificaiton.`,
      })
    }
  }

  const onTurnOffNotification = async () => {
    const setting = await updateSettingMutation({ fcmToken: null })

    setQueryData(setting)
  }

  const onTurnOnNotification = async () => {
    const isSupportedSync = await isSupported()

    if (!isSupportedSync) {
      toast({
        status: "error",
        title: t`The Push API is supported`,
      })
      return
    }

    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID,
      })

      const setting = await updateSettingMutation({ fcmToken: fcmToken })

      setQueryData(setting)

      toast({
        status: "success",
        title: t`Changes have bee saved`,
      })
    } catch (error: any) {
      toast({
        status: "error",
        title: error?.code,
        description: error?.message.replace(`(${error?.code}).`, ""),
      })
    }
  }

  return (
    <Stack spacing={8}>
      <SettingsPageNotification
        setting={setting}
        onTurnOnNotification={onTurnOnNotification}
        onTurnOffNotification={onTurnOffNotification}
        onSendTestNotification={onSendTestNotification}
        isLoadingTestNotificationMutation={isLoadingTestNotificationMutation}
        isLoadingUpdateSettingMutation={isLoadingUpdateSettingMutation}
      />
    </Stack>
  )
}
