import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { SettingsPageAccount } from "interface/settings/components/SettingsPageAccount"
import { SettingsPageDetail } from "interface/settings/components/SettingsPageDetail"
import { SettingsPageLogout } from "interface/settings/components/SettingsPageLogout"
import { SettingsPagePassword } from "interface/settings/components/SettingsPagePassword"

const SettingsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Settings")}</BoxHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <SettingsPageDetail />
      </Suspense>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <SettingsPageAccount />
      </Suspense>
      <SettingsPagePassword />
      <SettingsPageLogout />
    </StackMain>
  )
}

SettingsPage.getLayout = (page) => {
  return <Layout title={"Settings"}>{page}</Layout>
}

export default SettingsPage
