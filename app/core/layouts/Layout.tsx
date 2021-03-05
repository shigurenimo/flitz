import { Container, Stack } from "@chakra-ui/react"
import { useFirebaseCloudMessaging } from "app/core/hooks/useFirebaseCloudMessaging"
import { LayoutAside } from "app/core/layouts/components/LayoutAside"
import { LayoutHeader } from "app/core/layouts/components/LayoutHeader"
import { Head } from "blitz"
import React, { Suspense, FunctionComponent } from "react"

type LayoutProps = {
  title?: string
}

const Layout: FunctionComponent<LayoutProps> = ({
  title = "FLITZ",
  children,
}) => {
  useFirebaseCloudMessaging()

  return (
    <>
      <Head>
        <title>{title || "FLITZ"}</title>
        <link color={"#000000"} href={"favicon.svg"} rel={"mask-icon"} />
        <link href={"apple-touch-icon.png"} rel={"apple-touch-icon"} />
        <link href={"favicon.svg"} rel={"icon"} />
        <link href={"manifest.json"} rel={"manifest"} />
        <meta name={"theme-color"} content={"#ffffff"} />
        <link href={"https://fonts.gstatic.com"} rel="preconnect" />
        <link
          href={
            "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          }
          rel={"stylesheet"}
        />
      </Head>
      <Suspense fallback={<></>}>
        <LayoutAside />
        <Stack pl={{ base: 0, md: 56 }}>
          <Container maxW={"4xl"} centerContent w={"full"} px={0}>
            <LayoutHeader />
            {children}
          </Container>
        </Stack>
      </Suspense>
    </>
  )
}

export default Layout
