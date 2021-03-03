import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getUserPostsInfinite from "app/users/queries/getUserPostsInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const ShowUserPageListPosts: FunctionComponent = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedPosts] = useInfiniteQuery(
    getUserPostsInfinite,
    (page = { skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  return (
    <StackList divider={<StackDivider />}>
      {groupedPosts.map((group) => {
        if (group.isEmpty) {
          return (
            <Box key={"empty"} px={4}>
              <Alert key={"alert"} status={"info"}>
                <AlertIcon />
                {t("This user hasn't posted yet.")}
              </Alert>
            </Box>
          )
        }
        return group.posts.map((post) => {
          return <StackCardPost key={post.id} {...post} isDisabled={false} />
        })
      })}
    </StackList>
  )
}
