import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxMessageThreadList } from "interface/message/components/BoxMessageThreadList"

const MessageThreadsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Messages")}</BoxHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <BoxMessageThreadList />
      </Suspense>
    </StackMain>
  )
}

MessageThreadsPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default MessageThreadsPage
