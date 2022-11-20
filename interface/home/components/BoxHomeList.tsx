import { useSession } from "@blitzjs/auth"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import getReferences from "app/queries/getReferences"
import { StackList } from "interface/core/components/StackList"
import { BoxCardPost } from "interface/posts/components/BoxCardPost"

export const BoxHomeList: FC = () => {
  const session = useSession()

  const [pages] = useInfiniteQuery(
    getReferences,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 3,
    }
  )

  const references = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {references.map((reference) => (
        <BoxCardPost
          key={reference.id}
          isDisabled={
            session.userId !== null && session.userId === reference.user.id
          }
          {...reference}
        />
      ))}
    </StackList>
  )
}
