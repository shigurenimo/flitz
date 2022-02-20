import { Heading, HStack, Stack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  name: string | null
  username: string
}

export const BoxProfileUpdate: VFC<Props> = (props) => {
  return (
    <Stack>
      <HStack spacing={4} align={"center"}>
        <Stack flex={1} h={"full"}>
          <Heading size={"lg"}>{props.name}</Heading>
          <Stack spacing={0}>
            <Text fontSize={"md"}>{`@${props.username}`}</Text>
          </Stack>
        </Stack>
      </HStack>
    </Stack>
  )
}
