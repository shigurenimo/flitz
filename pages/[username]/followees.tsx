import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowUserPageListFollowees } from "app/users/components/ShowUserPageListFollowees"

const ShowUserFolloweesPage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.isLoading) {
    return <p>{"loading..."}</p>
  }

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Followees")}</BoxHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageListFollowees userId={session.userId} />
      </Suspense>
    </StackMain>
  )
}

ShowUserFolloweesPage.getLayout = (page) => {
  return <Layout title={"Followees"}>{page}</Layout>
}

export default ShowUserFolloweesPage
