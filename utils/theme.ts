import { extendTheme, theme as defaultTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  useSystemColorMode: true,
  colors: {
    primary: defaultTheme.colors.blue,
  },
  fonts: {
    body: "Noto Sans JP, sans-serif",
    heading: "Noto Sans JP, sans-serif",
    mono: "Menlo, monospace",
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
    },
  },
})
