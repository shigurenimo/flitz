import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Stack,
  StackDivider,
  Switch,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { QuerySetting } from "integrations/interface/types/querySetting"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { FiSend, FiZap, FiZapOff } from "react-icons/fi"

type Props = {
  setting: QuerySetting
  onTurnOnNotification(): void
  onTurnOffNotification(): void
  onSendTestNotification(): void
  isLoadingTestNotificationMutation: boolean
  isLoadingUpdateSettingMutation: boolean
}

export const SettingsPageNotification: FunctionComponent<Props> = ({
  setting,
  onTurnOnNotification,
  onTurnOffNotification,
  onSendTestNotification,
  isLoadingTestNotificationMutation,
  isLoadingUpdateSettingMutation,
}) => {
  const { t } = useTranslation()

  const isLoading =
    isLoadingTestNotificationMutation || isLoadingUpdateSettingMutation

  return (
    <Stack spacing={8} px={4}>
      <Heading size={"lg"}>{"通知"}</Heading>
      {setting.fcmToken && (
        <Stack spacing={4}>
          <Wrap spacing={4}>
            <WrapItem>
              <Button
                isDisabled={isLoading}
                isLoading={isLoadingUpdateSettingMutation}
                leftIcon={<Icon as={FiZapOff} fontSize={"xl"} />}
                loadingText={t`Turn off push notifications`}
                onClick={onTurnOffNotification}
              >
                {t`Turn off push notifications`}
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                isDisabled={isLoading}
                isLoading={isLoadingTestNotificationMutation}
                leftIcon={<Icon as={FiSend} fontSize={"xl"} />}
                loadingText={t`Test notificaiton`}
                onClick={onSendTestNotification}
              >
                {t`Test notificaiton`}
              </Button>
            </WrapItem>
          </Wrap>
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>{t`Only one device can use this feature. If you have already set it on another device, turn it off once.`}</AlertTitle>
          </Alert>
        </Stack>
      )}
      {setting.fcmToken && (
        <Stack spacing={4} divider={<StackDivider />}>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormLabel mb={0}>{"New Followers"}</FormLabel>
            <Switch isDisabled />
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormLabel mb={0}>{"Messages"}</FormLabel>
            <Switch isDisabled />
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormLabel mb={0}>{"Likes"}</FormLabel>
            <Switch isDisabled />
          </FormControl>
          <FormControl
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormLabel mb={0}>{"Quotations"}</FormLabel>
            <Switch isDisabled />
          </FormControl>
        </Stack>
      )}
      {!setting.fcmToken && (
        <Stack spacing={4}>
          <Box>
            <Button
              isDisabled={isLoading}
              isLoading={isLoadingUpdateSettingMutation}
              leftIcon={<Icon as={FiZap} fontSize={"xl"} />}
              loadingText={t`Turn on push notifications`}
              onClick={onTurnOnNotification}
            >
              {t`Turn on push notifications`}
            </Button>
          </Box>
          <Text>
            {t`Get push notifications to find out what’s going on when you’re not on Flitz. You can turn them off anytime.`}
          </Text>
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>{t`This feature does not support iOS devices.`}</AlertTitle>
          </Alert>
        </Stack>
      )}
    </Stack>
  )
}
