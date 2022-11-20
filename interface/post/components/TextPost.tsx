import { Text } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  text?: string | null
}

export const TextPost: FC<Props> = (props) => {
  if (!props.text) {
    return null
  }

  return (
    <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
      {props.text}
    </Text>
  )
}
