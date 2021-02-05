import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowExchangePageMessages } from "app/exchanges/components/ShowExchangePageMessages"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ShowExchangeRecipientPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />} pb={0}>
      <StackHeader>{t("Messages")}</StackHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <ShowExchangePageMessages />
      </Suspense>
    </StackMain>
  )
}

ShowExchangeRecipientPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default ShowExchangeRecipientPage
