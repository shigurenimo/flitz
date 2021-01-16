import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/components/StackList"
import { StackCardNotification } from "app/notifications/components/StackCardNotification"
import getNotificationsInfinite from "app/notifications/queries/getNotificationsInfinite"
import { useInfiniteQuery } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const NotificationsPageList: FunctionComponent = () => {
  const { t } = useTranslation()

  const [groupedNotifications] = useInfiniteQuery(
    getNotificationsInfinite,
    (page = { skip: 0 }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 8000,
    }
  )

  const [group] = groupedNotifications

  const isEmpty = group.notifications.length === 0

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
      {groupedNotifications.map((group) => {
        return group.notifications.map((notification) => {
          return (
            <StackCardNotification key={notification.id} {...notification} />
          )
        })
      })}
    </StackList>
  )
}
