import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { BoxCardPostSkeleton } from "app/posts/components/BoxCardPostSkeleton"
import React, { VFC } from "react"

export const BoxPostListFallback: VFC = () => {
  const skeletons = Array(8)
    .fill(null)
    .map((_, i) => i)

  return (
    <StackList divider={<StackDivider />}>
      {skeletons.map((key) => (
        <BoxCardPostSkeleton key={key} />
      ))}
    </StackList>
  )
}
