import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxNotificationList } from "interface/notification/components/BoxNotificationList"

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
