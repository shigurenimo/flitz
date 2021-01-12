import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/components/StackList"
import { StackCardPostSkeleton } from "app/posts/components/StackCardPostSkeleton"
import React, { FunctionComponent } from "react"

export const PostsPageListFallback: FunctionComponent = () => {
  const skeletons = Array(8)
    .fill(null)
    .map((_, i) => i)

  return (
    <StackList divider={<StackDivider />}>
      {skeletons.map((key) => (
        <StackCardPostSkeleton key={key} />
      ))}
    </StackList>
  )
}
