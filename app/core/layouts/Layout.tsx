import { Container, Stack } from "@chakra-ui/react"
import Head from "next/head"
import { FC, ReactNode, Suspense } from "react"
import { BoxMainFallback } from "app/core/components/BoxMainFallback"
import { useCloudMessaging } from "app/core/hooks/useCloudMessaging"
import { LayoutAside } from "app/core/layouts/components/BoxAside"
import { LayoutHeader } from "app/core/layouts/components/BoxHeader"

type Props = {
  children: ReactNode
  title?: string
}

const Layout: FC<Props> = (props) => {
  useCloudMessaging()

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
