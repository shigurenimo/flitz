import { BlitzPage } from "@blitzjs/next"
import React, { Suspense } from "react"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { UpdateUserPageDetail } from "interface/users/components/UpdateUserPageDetail"

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
