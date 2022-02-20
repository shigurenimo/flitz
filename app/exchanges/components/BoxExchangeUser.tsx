import { HStack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  user: {
    id: string
    name: string | null
    username: string | null
  }
}

export const BoxExchangeUser: VFC<Props> = (props) => {
  if (props.user.name) {
    return (
      <HStack align={"center"} pt={1}>
        <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
          {props.user.name}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
          {`@${props.user.username || props.user.id}`}
        </Text>
      </HStack>
    )
  }

  return (
    <HStack align={"center"} pt={1}>
      <Text fontWeight={"bold"} lineHeight={1}>
        {props.user.username || props.user.id}
      </Text>
    </HStack>
  )
}
