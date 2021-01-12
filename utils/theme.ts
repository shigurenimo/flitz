import { extendTheme, theme as defaultTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  useSystemColorMode: true,
  colors: {
    primary: defaultTheme.colors.purple,
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
