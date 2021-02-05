import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/core/components/StackHeader"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowUserPageListFollowers } from "app/users/components/ShowUserPageListFollowers"
import { BlitzPage, useSession } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ShowUserFolloweesPage: BlitzPage = () => {
  const { t } = useTranslation()

  const session = useSession()

  if (session.isLoading) {
    return <p>{"loading..."}</p>
  }

  return (
    <StackMain divider={<StackDivider />}>
      <StackHeader>{t("Followers")}</StackHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageListFollowers userId={session.userId} />
      </Suspense>
    </StackMain>
  )
}

ShowUserFolloweesPage.getLayout = (page) => {
  return <Layout title={"Followers"}>{page}</Layout>
}

export default ShowUserFolloweesPage
