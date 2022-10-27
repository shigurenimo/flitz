import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxPostList } from "interface/posts/components/BoxPostList"
import { BoxPostListFallback } from "interface/posts/components/BoxPostListFallback"

const PostsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Stream")}</BoxHeader>
      <Suspense fallback={<BoxPostListFallback />}>
        <BoxPostList />
      </Suspense>
    </StackMain>
  )
}

PostsPage.getLayout = (page) => {
  return <Layout title={"Stream"}>{page}</Layout>
}

export default PostsPage
