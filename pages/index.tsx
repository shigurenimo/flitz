import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { Stack, StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxHomeFormPost } from "interface/home/components/BoxHomeFormPost"
import { BoxHomeHero } from "interface/home/components/BoxHomeHero"
import { BoxHomeList } from "interface/home/components/BoxHomeList"
import { BoxHomeLogin } from "interface/home/components/BoxHomeLogin"
import { BoxPostList } from "interface/post/components/BoxPostList"
import { BoxPostListFallback } from "interface/post/components/BoxPostListFallback"

const HomePage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.userId === null) {
    return (
      <StackMain divider={<StackDivider />}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          align={"start"}
          spacing={4}
        >
          <BoxHomeHero />
          <BoxHomeLogin />
        </Stack>
        <Suspense fallback={<BoxPostListFallback />}>
          <BoxPostList />
        </Suspense>
      </StackMain>
    )
  }

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Home")}</BoxHeader>
      <BoxHomeFormPost />
      <Suspense fallback={<BoxPostListFallback />}>
        <BoxHomeList />
      </Suspense>
    </StackMain>
  )
}

HomePage.getLayout = (page) => {
  return <Layout title={"Posts"}>{page}</Layout>
}

export default HomePage
