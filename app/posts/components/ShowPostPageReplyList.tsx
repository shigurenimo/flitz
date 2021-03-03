import { Stack, StackDivider } from "@chakra-ui/react"
import { StackCardReply } from "app/posts/components/StackCardPostReply"
import getRepliesInfinite from "app/posts/queries/getRepliesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { FunctionComponent } from "react"

export const ShowPostPageReplyList: FunctionComponent = () => {
  const postId = useParam("postId", "string")

  const [groupedPosts] = useInfiniteQuery(
    getRepliesInfinite,
    (page = { skip: 0, replyId: postId }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  return (
    <Stack align={"stretch"} divider={<StackDivider />} spacing={4}>
      {groupedPosts.map((group) => {
        return group.posts.map((post) => {
          return <StackCardReply {...post} />
        })
      })}
    </Stack>
  )
}
