import { ColorModeScript } from "@chakra-ui/react"
import { BlitzScript, Document, DocumentHead, Html, Main } from "blitz"
import React from "react"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <DocumentHead />
        <body>
          <ColorModeScript initialColorMode={"dark"} />
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
