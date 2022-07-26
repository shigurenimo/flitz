import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { useInfiniteQuery } from "blitz"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { StackList } from "app/core/components/StackList"
import { BoxCardNotification } from "app/notifications/components/BoxCardNotification"
import getNotifications from "app/notifications/queries/getNotifications"
import { AppNotification } from "integrations/types"

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
