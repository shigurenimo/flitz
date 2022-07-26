import { StackDivider } from "@chakra-ui/react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxNotificationList } from "app/notifications/components/BoxNotificationList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const NotificationsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Notifications")}</BoxHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <BoxNotificationList />
      </Suspense>
    </StackMain>
  )
}

NotificationsPage.getLayout = (page) => {
  return <Layout title={"Notifications"}>{page}</Layout>
}

export default NotificationsPage
