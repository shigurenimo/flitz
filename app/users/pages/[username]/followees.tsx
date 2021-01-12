import { getSessionContext } from "@blitzjs/server"
import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
import { ShowUserPageListFollowees } from "app/users/components/ShowUserPageListFollowees"
import { BlitzPage, GetServerSideProps, PublicData } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

type Props = Partial<PublicData>

const ShowUserFolloweesPage: BlitzPage<Props> = ({ userId }) => {
  const { t } = useTranslation()

  return (
    <StackPage divider={<StackDivider />}>
      <StackHeader>{t("Followees")}</StackHeader>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageListFollowees userId={userId} />
      </Suspense>
    </StackPage>
  )
}

ShowUserFolloweesPage.getLayout = (page) => {
  return <Layout title={"Followees"}>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const session = await getSessionContext(req, res)

  return { props: session.publicData }
}

export default ShowUserFolloweesPage
