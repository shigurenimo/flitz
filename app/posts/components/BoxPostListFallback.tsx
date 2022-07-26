import { StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import { StackList } from "app/core/components/StackList"
import { BoxCardPostSkeleton } from "app/posts/components/BoxCardPostSkeleton"

export const BoxPostListFallback: FC = () => {
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
