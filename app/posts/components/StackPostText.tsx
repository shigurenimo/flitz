import { Text } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  text?: string | null
}

export const StackPostText: VFC<Props> = ({ text }) => {
  if (!text) {
    return null
  }

  return (
    <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
      {text}
    </Text>
  )
}
