import { ColorModeScript } from "@chakra-ui/react"
import { BlitzScript, Document, DocumentHead, Html, Main } from "blitz"
import React from "react"
import { theme } from "app/core/theme/theme"

class MyDocument extends Document {
  render() {
    const fontURL =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"

    return (
      <Html>
        <DocumentHead>
          <link rel={"preconnect"} href={"https://fonts.gstatic.com"} />
          <link href={fontURL} rel={"stylesheet"} />
        </DocumentHead>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
