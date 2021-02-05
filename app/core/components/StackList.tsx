import { Stack, StackProps, useBreakpointValue } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = StackProps

export const StackList: FunctionComponent<Props> = ({ children, ...props }) => {
  const spacing = useBreakpointValue({ base: 0, md: 4 })

  if (typeof spacing === "undefined") {
    return null
  }

  return (
    <Stack align={"stretch"} spacing={spacing} {...props}>
      {children}
    </Stack>
  )
}
