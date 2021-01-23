import { Heading, HStack, Stack, Text } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  id: string
  name: string | null
  username: string
  nextImage: File | null
}

export const StackProfileUpdate: FunctionComponent<Props> = ({
  id,
  name,
  username,
  nextImage,
}) => {
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
