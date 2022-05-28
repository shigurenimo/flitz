import { Heading, Stack } from "@chakra-ui/react"
import { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const BoxHeader: FC<Props> = (props) => {
  return (
    <Stack px={4}>
      <Heading letterSpacing={"wider"}>{props.children}</Heading>
    </Stack>
  )
}
