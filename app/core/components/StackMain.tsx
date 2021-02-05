import { Stack, StackProps } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = StackProps

export const StackMain: FunctionComponent<Props> = ({ children, ...props }) => {
  return (
    <Stack
      as={"main"}
      pb={16}
      pt={{ base: 4, md: 8 }}
      px={{ base: 0, md: 4 }}
      spacing={8}
      w={"full"}
      {...props}
    >
      {children}
    </Stack>
  )
}
