import {
  Stack,
  StackProps,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = StackProps

export const StackCard: FunctionComponent<Props> = ({ children, ...props }) => {
  const bg = useColorModeValue("gray.50", "gray.700")

  const rounded = useBreakpointValue({ base: "none", md: "md" })

  return (
    <Stack
      _hover={{ bg }}
      cursor={"pointer"}
      p={4}
      rounded={rounded}
      spacing={4}
      transitionDuration={"250ms"}
      transitionProperty={"background-color"}
      {...props}
    >
      {children}
    </Stack>
  )
}
