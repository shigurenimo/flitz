import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import getReferencesInfinite from "app/home/queries/getReferencesInfinite"
import { StackCardPost } from "app/posts/components/StackCardPost"
import { useInfiniteQuery, useSession } from "blitz"
import React, { FunctionComponent } from "react"

export const HomePageList: FunctionComponent = () => {
  const session = useSession()

  const [groupedReferences] = useInfiniteQuery(
    getReferencesInfinite,
    (page = { skip: 0 }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 3,
    }
  )

  return (
    <StackList divider={<StackDivider />}>
      {groupedReferences.map((group) => {
        return group.references.map((reference) => {
          return (
            <StackCardPost
              isDisabled={
                session.userId !== null && session.userId === reference.user.id
              }
              {...reference}
            />
          )
        })
      })}
    </StackList>
  )
}
