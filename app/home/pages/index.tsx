import { Stack, StackDivider } from "@chakra-ui/react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxHomeHero } from "app/home/components/BoxHomeHero"
import { BoxHomeInput } from "app/home/components/BoxHomeInput"
import { BoxHomeList } from "app/home/components/BoxHomeList"
import { BoxHomeLogin } from "app/home/components/BoxHomeLogin"
import { BoxPostList } from "app/posts/components/BoxPostList"
import { BoxPostListFallback } from "app/posts/components/BoxPostListFallback"
import { BlitzPage, useSession } from "blitz"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useTranslation } from "react-i18next"

const HomePage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.isLoading) {
    return <div>{"Loading..."}</div>
  }

  if (!session.userId) {
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
      <BoxHomeInput />
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={<BoxPostListFallback />}>
          <BoxHomeList />
        </Suspense>
      </ErrorBoundary>
    </StackMain>
  )
}

HomePage.getLayout = (page) => {
  return <Layout title={"Posts"}>{page}</Layout>
}

export default HomePage
