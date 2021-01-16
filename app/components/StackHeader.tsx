import { Heading, Stack } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

export const StackHeader: FunctionComponent = ({ children }) => {
  return (
    <Stack px={4}>
      <Heading letterSpacing={"wider"}>{children}</Heading>
    </Stack>
  )
}
