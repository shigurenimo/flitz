import { Heading, Stack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const BoxUserName: VFC<Props> = (props) => {
  return (
    <Stack flex={1} h={"full"}>
      <Heading size={"lg"}>{props.name}</Heading>
      <Stack spacing={0}>
        <Text fontSize={"md"}>{`@${props.username}`}</Text>
      </Stack>
    </Stack>
  )
}
