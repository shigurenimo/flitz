import { Stack, StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { HomePageHero } from "app/home/components/HomePageHero"
import { HomePageInput } from "app/home/components/HomePageInput"
import { HomePageList } from "app/home/components/HomePageList"
import { HomePageLogin } from "app/home/components/HomePageLogin"
import { PostsPageList } from "app/posts/components/PostsPageList"
import { PostsPageListFallback } from "app/posts/components/PostsPageListFallback"
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
          <HomePageHero />
          <HomePageLogin />
        </Stack>
        <Suspense fallback={<PostsPageListFallback />}>
          <PostsPageList />
        </Suspense>
      </StackMain>
    )
  }

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{t("Home")}</StackHeader>
      <HomePageInput />
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={<PostsPageListFallback />}>
          <HomePageList />
        </Suspense>
      </ErrorBoundary>
    </StackMain>
  )
}

HomePage.getLayout = (page) => {
  return <Layout title={"Posts"}>{page}</Layout>
}

export default HomePage
