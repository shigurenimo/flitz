import { ColorModeScript } from "@chakra-ui/react"
import { theme } from "app/core/theme/theme"
import { BlitzScript, Document, DocumentHead, Html, Main } from "blitz"
import React from "react"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <DocumentHead />
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
