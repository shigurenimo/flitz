import { StackDivider } from "@chakra-ui/react"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxExchangeMessages } from "app/exchanges/components/BoxExchangePageMessages"

const ShowExchangeRecipientPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />} pb={0}>
      <BoxHeader>{t("Messages")}</BoxHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <BoxExchangeMessages />
      </Suspense>
    </StackMain>
  )
}

ShowExchangeRecipientPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default ShowExchangeRecipientPage
