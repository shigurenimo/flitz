import { Stack, StackProps } from "@chakra-ui/react"
import React, { FC } from "react"

type Props = StackProps

export const StackAside: FC<Props> = ({ children, ...props }) => {
  return (
    <Stack
      as={"aside"}
      bottom={0}
      display={{ base: "none", md: "inherit" }}
      position={"fixed"}
      top={0}
      w={56}
      pl={4}
      py={8}
      zIndex={50}
    >
      <Stack as={"nav"} alignSelf={"center"} spacing={4} w={"full"}>
        {children}
      </Stack>
    </Stack>
  )
}
