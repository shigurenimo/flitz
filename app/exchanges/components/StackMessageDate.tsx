import { HStack, StackProps, Text } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = StackProps & {
  createdAt: Date
}

export const StackMessageDate: FunctionComponent<Props> = ({ createdAt, ...props }) => {
  return (
    <HStack align={"center"} spacing={2} {...props}>
      <Text color={"gray.500"} fontSize={"sm"}>
        {createdAt.toLocaleTimeString()}
      </Text>
      <Text color={"gray.500"} fontSize={"sm"}>
        {createdAt.toDateString()}
      </Text>
    </HStack>
  )
}
