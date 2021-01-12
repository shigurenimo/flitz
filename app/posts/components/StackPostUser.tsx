import { HStack, Text } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  user: {
    id: string
    name: string | null
    username: string | null
  }
}

export const StackPostUser: FunctionComponent<Props> = ({ user }) => {
  if (user.name) {
    return (
      <HStack align={"center"} pt={1}>
        <Text fontWeight={"bold"} lineHeight={1}>
          {user.name}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
          {`@${user.username || user.id}`}
        </Text>
      </HStack>
    )
  }

  return (
    <HStack align={"center"} pt={1}>
      <Text fontWeight={"bold"} lineHeight={1}>
        {user.username || user.id}
      </Text>
    </HStack>
  )
}
