import { HStack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  createdAt: Date
}

export const BoxPostDate: VFC<Props> = (props) => {
  return (
    <HStack align={"center"} spacing={2}>
      <Text color={"gray.500"} fontSize={"sm"}>
        {props.createdAt.toLocaleTimeString()}
      </Text>
      <Text color={"gray.500"} fontSize={"sm"}>
        {props.createdAt.toDateString()}
      </Text>
    </HStack>
  )
}
