import { Container, Stack } from "@chakra-ui/react"
import { BoxMainFallback } from "app/core/components/BoxMainFallback"
import { useFirebaseCloudMessaging } from "app/core/hooks/useFirebaseCloudMessaging"
import { LayoutAside } from "app/core/layouts/components/BoxAside"
import { LayoutHeader } from "app/core/layouts/components/BoxHeader"
import { Head } from "blitz"
import React, { FC, Suspense } from "react"

type LayoutProps = {
  title?: string
}

const Layout: FC<LayoutProps> = (props) => {
  useFirebaseCloudMessaging()

  const fontURL =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"

  return (
    <>
      <Head>
        <title>{props.title ?? "FLITZ"}</title>
        <link color={"#000000"} href={"favicon.svg"} rel={"mask-icon"} />
        <link href={"apple-touch-icon.png"} rel={"apple-touch-icon"} />
        <link href={"favicon.svg"} rel={"icon"} />
        <link href={"manifest.json"} rel={"manifest"} />
        <meta name={"theme-color"} content={"#ffffff"} />
        <link href={"https://fonts.gstatic.com"} rel="preconnect" />
        <link href={fontURL} rel={"stylesheet"} />
      </Head>
      <Suspense fallback={null}>
        <LayoutAside />
      </Suspense>
      <Stack pl={{ base: 0, md: 56 }}>
        <Container maxW={"4xl"} centerContent w={"full"} px={0}>
          <Suspense fallback={<BoxMainFallback />}>
            <LayoutHeader />
            {props.children}
          </Suspense>
        </Container>
      </Stack>
    </>
  )
}

export default Layout
