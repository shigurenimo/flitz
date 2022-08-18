import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { BoxFormPost } from "app/posts/components/BoxFormPost"
import { BoxPostDetail } from "app/posts/components/BoxPostDetail"
import { BoxPostReplyList } from "app/posts/components/BoxPostReplyList"

const ShowPostPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Post")}</BoxHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <BoxPostDetail />
      </Suspense>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <BoxFormPost />
      </Suspense>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <BoxPostReplyList />
      </Suspense>
    </StackMain>
  )
}

ShowPostPage.getLayout = (page) => {
  return <Layout title={"Post"}>{page}</Layout>
}

export default ShowPostPage
