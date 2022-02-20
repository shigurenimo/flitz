import { HStack, Text, Wrap, WrapItem } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = {
  id: string
  name: string | null
  username: string | null
}

export const BoxPostUser: VFC<Props> = (props) => {
  if (props.name) {
    return (
      <Wrap align={["flex-start", "center"]}>
        <WrapItem>
          <Text fontWeight={"bold"} lineHeight={1}>
            {props.name}
          </Text>
        </WrapItem>
        <WrapItem>
          <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
            {`@${props.username || props.id}`}
          </Text>
        </WrapItem>
      </Wrap>
    )
  }

  return (
    <HStack align={"center"} pt={1}>
      <Text fontWeight={"bold"} lineHeight={1}>
        {props.username || props.id}
      </Text>
    </HStack>
  )
}
