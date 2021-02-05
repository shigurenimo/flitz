import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowPostPageDetail } from "app/posts/components/ShowPostPageDetail"
import { ShowPostPageInput } from "app/posts/components/ShowPostPageInput"
import { ShowPostPageReplyList } from "app/posts/components/ShowPostPageReplyList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ShowPostPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{t("Post")}</StackHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowPostPageDetail />
      </Suspense>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowPostPageInput />
      </Suspense>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowPostPageReplyList />
      </Suspense>
    </StackMain>
  )
}

ShowPostPage.getLayout = (page) => {
  return <Layout title={"Post"}>{page}</Layout>
}

export default ShowPostPage
