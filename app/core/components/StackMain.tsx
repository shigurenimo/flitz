import { Stack, StackProps } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = StackProps

export const StackMain: VFC<Props> = (props) => {
  return (
    <Stack
      as={"main"}
      pb={16}
      pt={{ base: 4, md: 8 }}
      px={{ base: 0, md: 4 }}
      spacing={8}
      w={"full"}
      {...props}
    />
  )
}
