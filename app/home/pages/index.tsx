import { getSessionContext } from "@blitzjs/server"
import { StackDivider } from "@chakra-ui/react"
import { StackFallbackLogin } from "app/components/StackFallbackLogin"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import { HomePageInput } from "app/home/components/HomePageInput"
import { HomePageList } from "app/home/components/HomePageList"
import Layout from "app/layouts/Layout"
import { PostsPageListFallback } from "app/posts/components/PostsPageListFallback"
import { BlitzPage, GetServerSideProps, PublicData } from "blitz"
import path from "path"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useTranslation } from "react-i18next"

type Props = Partial<PublicData>

const HomePage: BlitzPage<Props> = ({ userId }) => {
  const { t } = useTranslation()

  if (!userId) {
    return (
      <StackPage divider={<StackDivider />}>
        <StackHeader>{t("Home")}</StackHeader>
        <StackFallbackLogin />
      </StackPage>
    )
  }

  return (
    <StackPage divider={<StackDivider />}>
      <StackHeader>{t("Home")}</StackHeader>
      <HomePageInput />
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={<PostsPageListFallback />}>
          <HomePageList />
        </Suspense>
      </ErrorBoundary>
    </StackPage>
  )
}

HomePage.getLayout = (page) => {
  return <Layout title={"Posts"}>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  // https://github.com/blitz-js/blitz/issues/794
  path.resolve("blitz.config.js")
  path.resolve(".next/__db.js")

  const session = await getSessionContext(req, res)

  return { props: session.publicData }
}

export default HomePage
