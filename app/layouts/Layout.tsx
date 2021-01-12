import { Container, Stack } from "@chakra-ui/react"
import { LayoutAside } from "app/layouts/components/LayoutAside"
import { LayoutHeader } from "app/layouts/components/LayoutHeader"
import { Head } from "blitz"
import React, { FunctionComponent } from "react"

type LayoutProps = {
  title?: string
}

const Layout: FunctionComponent<LayoutProps> = ({ title = "Flitz", children }) => {
  return (
    <>
      <Head>
        <title>{title || "Flitz"}</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>
      <LayoutAside />
      <Stack pl={{ base: 0, md: 56 }}>
        <Container maxW={"4xl"} centerContent w={"full"} px={0}>
          <LayoutHeader />
          {children}
        </Container>
      </Stack>
    </>
  )
}

export default Layout
