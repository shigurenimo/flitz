import { extendTheme, theme as defaultTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  colors: {
    primary: defaultTheme.colors.blue,
  },
  fonts: {
    body: ["Noto Sans JP", "system-ui", "sans-serif"].join(","),
    heading: ["Noto Sans JP", "system-ui", "sans-serif"].join(","),
    mono: ["Menlo", "monospace"].join(","),
  },
  styles: {
    global: {
      html: {
        overscrollBehaviorY: "none",
        overflowY: "auto",
      },
      "*": {
        WebkitTapHighlightColor: "transparent",
      },
      "#__next": {
        maxWidth: "80rem",
        margin: "0 auto",
      },
    },
  },
})
