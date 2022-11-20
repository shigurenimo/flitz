import { useInfiniteQuery } from "@blitzjs/rpc"
import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import getNotifications from "app/queries/getNotifications"
import { AppNotification } from "infrastructure/models"
import { StackList } from "interface/core/components/StackList"
import { BoxCardNotification } from "interface/notifications/components/BoxCardNotification"

export const BoxNotificationList: FC = () => {
  const { t } = useTranslation()

  const [pages] = useInfiniteQuery(
    getNotifications,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const notifications = pages
    .flatMap((page) => page.items)
    .filter((notification): notification is AppNotification => {
      return notification !== null
    })

  const isEmpty = notifications.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Box px={4}>
          <Alert status={"info"}>
            <AlertIcon />
            {t("No Notifications")}
          </Alert>
        </Box>
      )}
      {notifications.map((notification) => (
        <BoxCardNotification key={notification.id} {...notification} />
      ))}
    </StackList>
  )
}
