import { Heading, Stack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const StackUserName: VFC<Props> = ({ id, name, username }) => {
  return (
    <Stack flex={1} h={"full"}>
      <Heading size={"lg"}>{name}</Heading>
      <Stack spacing={0}>
        <Text fontSize={"md"}>{`@${username}`}</Text>
      </Stack>
    </Stack>
  )
}
