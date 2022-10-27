import { useInfiniteQuery } from "@blitzjs/rpc"
import { StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import getPosts from "integrations/queries/getPosts"
import { StackList } from "interface/core/components/StackList"
import { BoxCardPost } from "interface/posts/components/BoxCardPost"

export const BoxPostListPublic: FC = () => {
  const [pages] = useInfiniteQuery(getPosts, (page = { skip: 0 }) => page, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchInterval: 1000 * 2 ** 4,
  })

  const posts = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {posts.map((post) => {
        return <BoxCardPost key={post.id} isDisabled={true} {...post} />
      })}
    </StackList>
  )
}