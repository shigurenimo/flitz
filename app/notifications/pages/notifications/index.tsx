import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackMain } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
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
