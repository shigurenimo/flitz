import { Stack, Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const StackPostReply: VFC<Props> = ({ name }) => {
  return (
    <Stack>
      <Text
        color={"primary.500"}
        fontWeight={"bold"}
        fontSize={"sm"}
        lineHeight={1}
      >
        {`Replying to @${name}`}
      </Text>
    </Stack>
  )
}
