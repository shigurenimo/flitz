import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { BoxFormPost } from "interface/posts/components/BoxFormPost"
import { BoxPostDetail } from "interface/posts/components/BoxPostDetail"
import { BoxPostReplyList } from "interface/posts/components/BoxPostReplyList"

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
