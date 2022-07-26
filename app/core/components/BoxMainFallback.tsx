import { StackDivider, StackProps } from "@chakra-ui/react"
import { FC } from "react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"

type Props = StackProps

export const BoxMainFallback: FC<Props> = (props) => {
  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{"Loading..."}</BoxHeader>
    </StackMain>
  )
}
