import { Heading, Stack } from "@chakra-ui/react"
import React, { FC } from "react"

export const StackHeader: FC = (props) => {
  return (
    <Stack px={4}>
      <Heading letterSpacing={"wider"}>{props.children}</Heading>
    </Stack>
  )
}
