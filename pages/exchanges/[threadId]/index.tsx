import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxMessageThreadMessages } from "interface/message/components/BoxMessageThreadMessages"

const MessageThreadPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />} pb={0}>
      <BoxHeader>{t("Messages")}</BoxHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <BoxMessageThreadMessages />
      </Suspense>
    </StackMain>
  )
}

MessageThreadPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default MessageThreadPage
