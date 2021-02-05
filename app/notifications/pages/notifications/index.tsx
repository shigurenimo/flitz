import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { NotificationsPageList } from "app/notifications/components/NotificationsPageList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const NotificationsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{t("Notifications")}</StackHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <NotificationsPageList />
      </Suspense>
    </StackMain>
  )
}

NotificationsPage.getLayout = (page) => {
  return <Layout title={"Notifications"}>{page}</Layout>
}

export default NotificationsPage
