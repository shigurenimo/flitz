import { StackDivider } from "@chakra-ui/react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxExchangeList } from "app/exchanges/components/BoxExchangeList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ExchangesPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Messages")}</BoxHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <BoxExchangeList />
      </Suspense>
    </StackMain>
  )
}

ExchangesPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default ExchangesPage
