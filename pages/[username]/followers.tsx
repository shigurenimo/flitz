import { StackDivider } from "@chakra-ui/react"
import { BlitzPage, useSession } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowUserPageListFollowers } from "app/users/components/ShowUserPageListFollowers"

const ShowUserFollowersPage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.isLoading) {
    return <p>{"loading..."}</p>
  }

  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{t("Followers")}</BoxHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageListFollowers userId={session.userId} />
      </Suspense>
    </StackMain>
  )
}

ShowUserFollowersPage.getLayout = (page) => {
  return <Layout title={"Followers"}>{page}</Layout>
}

export default ShowUserFollowersPage
