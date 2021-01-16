import { Container, Stack } from "@chakra-ui/react"
import { LayoutAside } from "app/layouts/components/LayoutAside"
import { LayoutHeader } from "app/layouts/components/LayoutHeader"
import { Head } from "blitz"
import React, { FunctionComponent } from "react"

type LayoutProps = {
  title?: string
}

const Layout: FunctionComponent<LayoutProps> = ({
  title = "Flitz",
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "Flitz"}</title>
        <link color={"#000000"} href={"favicon.svg"} rel={"mask-icon"} />
        <link href={"apple-touch-icon.png"} rel={"apple-touch-icon"} />
        <link href={"favicon.svg"} rel={"icon"} />
        <link href={"manifest.json"} rel={"manifest"} />
        <meta name={"theme-color"} content={"#ffffff"} />
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
