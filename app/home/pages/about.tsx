import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
import { BlitzPage } from "blitz"
import React from "react"
import { useTranslation } from "react-i18next"

const AboutPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackPage divider={<StackDivider />}>
      <StackHeader>{t("About Flitz")}</StackHeader>
    </StackPage>
  )
}

AboutPage.getLayout = (page) => {
  return <Layout title={"About Flitz"}>{page}</Layout>
}

export default AboutPage
