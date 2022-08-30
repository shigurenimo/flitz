import "reflect-metadata"
import "integrations/errors"
import { ColorModeScript } from "@chakra-ui/react"
import { Html, Head, Main, NextScript } from "next/document"
import React, { FC } from "react"
import { theme } from "app/core/theme/theme"

const Document: FC = () => {
  const fontURL =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"

  return (
    <Html>
      <Head>
        <link rel={"preconnect"} href={"https://fonts.gstatic.com"} />
        <link href={fontURL} rel={"stylesheet"} />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
