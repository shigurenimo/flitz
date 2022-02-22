import { StackDivider, StackProps } from "@chakra-ui/react"
import { BoxHeader } from "app/core/components/BoxHeader"
import { StackMain } from "app/core/components/StackMain"
import React, { VFC } from "react"

type Props = StackProps

export const BoxMainFallback: VFC<Props> = (props) => {
  return (
    <StackMain divider={<StackDivider />}>
      <BoxHeader>{"Loading..."}</BoxHeader>
    </StackMain>
  )
}