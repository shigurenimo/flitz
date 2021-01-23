import { HStack, Text, Wrap, WrapItem } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  id: string
  name: string | null
  username: string | null
}

export const StackPostUser: FunctionComponent<Props> = ({
  id,
  name,
  username,
}) => {
  if (name) {
    return (
      <Wrap align={["flex-start", "center"]}>
        <WrapItem>
          <Text fontWeight={"bold"} lineHeight={1}>
            {name}
          </Text>
        </WrapItem>
        <WrapItem>
          <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
            {`@${username || id}`}
          </Text>
        </WrapItem>
      </Wrap>
    )
  }

  return (
    <HStack align={"center"} pt={1}>
      <Text fontWeight={"bold"} lineHeight={1}>
        {username || id}
      </Text>
    </HStack>
  )
}
