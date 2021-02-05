import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { PostsPageList } from "app/posts/components/PostsPageList"
import { PostsPageListFallback } from "app/posts/components/PostsPageListFallback"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const PostsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{t("Stream")}</StackHeader>
      <Suspense fallback={<PostsPageListFallback />}>
        <PostsPageList />
      </Suspense>
    </StackMain>
  )
}

PostsPage.getLayout = (page) => {
  return <Layout title={"Stream"}>{page}</Layout>
}

export default PostsPage
