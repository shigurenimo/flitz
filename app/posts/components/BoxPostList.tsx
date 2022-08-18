import { useSession } from "@blitzjs/auth"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import { StackList } from "app/core/components/StackList"
import { BoxCardPost } from "app/posts/components/BoxCardPost"
import getPosts from "app/posts/queries/getPosts"

export const BoxPostList: FC = () => {
  const session = useSession()

  const [pages] = useInfiniteQuery(getPosts, (page = { skip: 0 }) => page, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchInterval: 1000 * 2 ** 4,
  })

  const posts = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {posts.map((post) => (
        <BoxCardPost
          key={post.id}
          isDisabled={!session.userId || session.userId === post.user.id}
          {...post}
        />
      ))}
    </StackList>
  )
}
