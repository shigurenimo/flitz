import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { SettingsPageAccount } from "app/settings/components/SettingsPageAccount"
import { SettingsPageDetail } from "app/settings/components/SettingsPageDetail"
import { SettingsPageLogout } from "app/settings/components/SettingsPageLogout"
import { SettingsPagePassword } from "app/settings/components/SettingsPagePassword"

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
