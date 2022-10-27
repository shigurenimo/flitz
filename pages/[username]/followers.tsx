import { useSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { StackDivider } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { ShowUserPageListFollowers } from "interface/users/components/ShowUserPageListFollowers"

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
