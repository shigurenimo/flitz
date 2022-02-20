import { Heading, HStack, Stack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  name: string | null
  username: string
}

export const StackProfileUpdate: VFC<Props> = ({ name, username }) => {
  return (
    <Stack>
      <HStack spacing={4} align={"center"}>
        <Stack flex={1} h={"full"}>
          <Heading size={"lg"}>{name}</Heading>
          <Stack spacing={0}>
            <Text fontSize={"md"}>{`@${username}`}</Text>
          </Stack>
        </Stack>
      </HStack>
    </Stack>
  )
}
