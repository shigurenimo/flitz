import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getPostsInfinite from "app/posts/queries/getPostsInfinite"
import { useInfiniteQuery } from "blitz"
import React, { VFC } from "react"

export const PostsPagePublicList: VFC = () => {
  const [pages] = useInfiniteQuery(
    getPostsInfinite,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {posts.map((post) => {
        return <StackCardPost isDisabled={true} {...post} />
      })}
    </StackList>
  )
}
