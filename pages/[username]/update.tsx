import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { UpdateUserPageDetail } from "app/users/components/UpdateUserPageDetail"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const UpdateUserPage: BlitzPage = () => {
  return (
    <StackMain pt={{ base: 0, md: 8 }}>
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
