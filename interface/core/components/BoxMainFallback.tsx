import { StackDivider, StackProps } from "@chakra-ui/react"
import { FC } from "react"
import { BoxHeader } from "interface/core/components/BoxHeader"
import { StackMain } from "interface/core/components/StackMain"

type Props = StackProps

export const BoxMainFallback: FC<Props> = (props) => {
  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{"Loading..."}</BoxHeader>
    </StackMain>
  )
}
