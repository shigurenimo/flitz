import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackMain } from "app/components/StackMain"
import { ShowExchangePageMessages } from "app/exchanges/components/ShowExchangePageMessages"
import Layout from "app/layouts/Layout"
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
