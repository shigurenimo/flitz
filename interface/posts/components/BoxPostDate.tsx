import { HStack, Text } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  createdAt: Date
}

export const BoxPostDate: FC<Props> = (props) => {
  return (
    <HStack align={"center"} spacing={2}>
      <Text color={"gray.500"} fontSize={"sm"}>
        {props.createdAt.toLocaleTimeString()}
      </Text>
      <Text color={"gray.500"} fontSize={"sm"}>
        {props.createdAt.toDateString()}
      </Text>
    </HStack>
  )
}
