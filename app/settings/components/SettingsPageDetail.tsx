import { Stack, useToast } from "@chakra-ui/react"
import { SettingsPageNotification } from "app/settings/components/SettingsPageNotification"
import testNotification from "app/settings/mutations/testNotification"
import updateSetting from "app/settings/mutations/updateSetting"
import getSetting from "app/settings/queries/getSetting"
import { useMutation, useQuery } from "blitz"
import firebase from "firebase/app"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const SettingsPageDetail: FunctionComponent = () => {
  const { t } = useTranslation()

  const [setting, { setQueryData }] = useQuery(getSetting, null, {
    refetchInterval: false,
  })

  const [
    testNotificationMutation,
    { isLoading: isLoadingTestNotificationMutation },
  ] = useMutation(testNotification)

  const [
    updateSettingMutation,
    { isLoading: isLoadingUpdateSettingMutation },
  ] = useMutation(updateSetting)

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
    if (!firebase.messaging.isSupported()) {
      toast({
        status: "error",
        title: t`The Push API is supported`,
      })
      return
    }

    try {
      const messaging = firebase.messaging()

      const fcmToken = await messaging.getToken({
        vapidKey: process.env.NEXT_PUBLIC_VAPID,
      })

      const setting = await updateSettingMutation({ fcmToken: fcmToken })

      setQueryData(setting)

      toast({
        status: "success",
        title: t`Changes have bee saved`,
      })
    } catch (err) {
      toast({
        status: "error",
        title: err.code,
        description: err.message.replace(`(${err.code}).`, ""),
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
