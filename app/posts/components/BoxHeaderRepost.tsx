import { HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import React, { VFC } from "react"
import { FiRepeat } from "react-icons/fi"

type Props = { name: string }

export const BoxHeaderRepost: VFC<Props> = (props) => {
  const bg = useColorModeValue("purple.50", "gray.600")

  return (
    <HStack>
      <HStack bg={bg} px={4} py={1} rounded={"md"}>
        <Icon as={FiRepeat} />
        <Text fontWeight={"bold"} fontSize={"sm"}>
          {`${props.name} Reposted`}
        </Text>
      </HStack>
    </HStack>
  )
}
