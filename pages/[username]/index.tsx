import { BlitzPage } from "@blitzjs/next"
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import React, { Suspense } from "react"
import { StackMain } from "interface/core/components/StackMain"
import Layout from "interface/core/layouts/Layout"
import { ShowUserPageDetail } from "interface/users/components/ShowUserPageDetail"
import { ShowUserPageListLikes } from "interface/users/components/ShowUserPageListLikes"
import { ShowUserPageListPosts } from "interface/users/components/ShowUserPageListPosts"
import { ShowUserPageListReplies } from "interface/users/components/ShowUserPageListReplies"

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
