import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { Stack, StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxHomeFormPost } from "app/home/components/BoxHomeFormPost"
import { BoxHomeHero } from "app/home/components/BoxHomeHero"
import { BoxHomeList } from "app/home/components/BoxHomeList"
import { BoxHomeLogin } from "app/home/components/BoxHomeLogin"
import { BoxPostList } from "app/posts/components/BoxPostList"
import { BoxPostListFallback } from "app/posts/components/BoxPostListFallback"

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
