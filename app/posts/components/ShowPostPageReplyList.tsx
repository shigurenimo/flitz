import { Stack, StackDivider } from "@chakra-ui/react"
import { StackCardReply } from "app/posts/components/StackCardPostReply"
import getRepliesInfinite from "app/posts/queries/getRepliesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { VFC } from "react"

export const ShowPostPageReplyList: VFC = () => {
  const postId = useParam("postId", "string")

  const [pages] = useInfiniteQuery(
    getRepliesInfinite,
    (page = { skip: 0, replyId: postId }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  return (
    <Stack align={"stretch"} divider={<StackDivider />} spacing={4}>
      {posts.map((post) => {
        return <StackCardReply key={post.id} {...post} />
      })}
    </Stack>
  )
}
