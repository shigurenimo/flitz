import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
import { ShowPostPageDetail } from "app/posts/components/ShowPostPageDetail"
import { ShowPostPageInput } from "app/posts/components/ShowPostPageInput"
import { ShowPostPageReplyList } from "app/posts/components/ShowPostPageReplyList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ShowPostPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackPage divider={<StackDivider />}>
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
    </StackPage>
  )
}

ShowPostPage.getLayout = (page) => {
  return <Layout title={"Post"}>{page}</Layout>
}

export default ShowPostPage
