import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { StackMain } from "app/core/components/StackMain"
import Layout from "app/core/layouts/Layout"
import { ShowUserPageDetail } from "app/users/components/ShowUserPageDetail"
import { ShowUserPageListLikes } from "app/users/components/ShowUserPageListLikes"
import { ShowUserPageListPosts } from "app/users/components/ShowUserPageListPosts"
import { ShowUserPageListReplies } from "app/users/components/ShowUserPageListReplies"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const ShowUserPage: BlitzPage = () => {
  return (
    <StackMain pt={{ base: 0, md: 8 }}>
      <Suspense fallback={<div>{"loading..."}</div>}>
        <ShowUserPageDetail />
      </Suspense>
      <Tabs variant={"enclosed"}>
        <TabList px={4}>
          <Tab>{"Posts"}</Tab>
          <Tab>{"Replies"}</Tab>
          <Tab>{"Likes"}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Suspense fallback={<div>{"loading..."}</div>}>
              <ShowUserPageListPosts />
            </Suspense>
          </TabPanel>
          <TabPanel px={0}>
            <Suspense fallback={<div>{"loading..."}</div>}>
              <ShowUserPageListReplies />
            </Suspense>
          </TabPanel>
          <TabPanel px={0}>
            <Suspense fallback={<div>{"loading..."}</div>}>
              <ShowUserPageListLikes />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </StackMain>
  )
}

ShowUserPage.getLayout = (page) => {
  return <Layout title={"User"}>{page}</Layout>
}

export default ShowUserPage
