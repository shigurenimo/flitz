import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getUserLikesInfinite from "app/users/queries/getUserLikesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const ShowUserPageListLikes: FunctionComponent = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedLikes] = useInfiniteQuery(
    getUserLikesInfinite,
    (page = { skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  return (
    <StackList divider={<StackDivider />}>
      {groupedLikes.map((group) => {
        if (group.isEmpty) {
          return (
            <Box key={"empty"} px={4}>
              <Alert status={"info"}>
                <AlertIcon />
                {t("This user hasn't liked any post yet.")}
              </Alert>
            </Box>
          )
        }

        return group.likes.map((post) => {
          return <StackCardPost key={post.id} {...post} isDisabled={false} />
        })
      })}
    </StackList>
  )
}
