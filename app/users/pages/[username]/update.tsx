import { StackMain } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
import { UpdateUserPageDetail } from "app/users/components/UpdateUserPageDetail"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const UpdateUserPage: BlitzPage = () => {
  return (
    <StackMain>
      <Suspense fallback={null}>
        <UpdateUserPageDetail />
      </Suspense>
    </StackMain>
  )
}

UpdateUserPage.getLayout = (page) => {
  return <Layout title={"User"}>{page}</Layout>
}

export default UpdateUserPage
