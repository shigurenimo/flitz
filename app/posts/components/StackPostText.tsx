import { Text } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  text?: string | null
}

export const StackPostText: FunctionComponent<Props> = ({ text }) => {
  if (!text) {
    return null
  }

  return (
    <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
      {text}
    </Text>
  )
}
