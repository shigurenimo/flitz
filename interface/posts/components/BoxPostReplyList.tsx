import { useParam } from "@blitzjs/next"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { Stack, StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import getPostReplies from "app/queries/getPostReplies"
import { BoxCardPostReply } from "interface/posts/components/BoxCardPostReply"

export const BoxPostReplyList: FC = () => {
  const postId = useParam("postId", "string")

  const [pages] = useInfiniteQuery(
    getPostReplies,
    (page = { skip: 0, replyId: postId }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  return (
    <Stack align={"stretch"} divider={<StackDivider />} spacing={4}>
      {posts.map((post) => {
        return <BoxCardPostReply key={post.id} {...post} />
      })}
    </Stack>
  )
}
