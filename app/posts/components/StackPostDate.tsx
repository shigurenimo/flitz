import { HStack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  createdAt: Date
}

export const StackPostDate: VFC<Props> = ({ createdAt }) => {
  return (
    <HStack align={"center"} spacing={2}>
      <Text color={"gray.500"} fontSize={"sm"}>
        {createdAt.toLocaleTimeString()}
      </Text>
      <Text color={"gray.500"} fontSize={"sm"}>
        {createdAt.toDateString()}
      </Text>
    </HStack>
  )
}
