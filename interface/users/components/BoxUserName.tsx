import { Heading, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const BoxUserName: FC<Props> = (props) => {
  return (
    <Stack flex={1} h={"full"}>
      <Heading size={"lg"}>{props.name}</Heading>
      <Stack spacing={0}>
        <Text fontSize={"md"}>{`@${props.username}`}</Text>
      </Stack>
    </Stack>
  )
}
