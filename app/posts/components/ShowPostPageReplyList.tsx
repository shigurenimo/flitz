import { Stack, StackDivider } from "@chakra-ui/react"
import { StackCardPost } from "app/posts/components/StackCardPost"
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
      refetchInterval: 2000,
    }
  )

  return (
    <Stack align={"stretch"} divider={<StackDivider />} spacing={4}>
      {groupedPosts.map((group) => {
        return group.posts.map((post) => {
          return <StackCardPost {...post} />
        })
      })}
    </Stack>
  )
}
