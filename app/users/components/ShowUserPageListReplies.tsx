import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/components/StackList"
import { StackCardPost } from "app/posts/components/StackCardPost"
import getUserRepliesInfinite from "app/users/queries/getUserRepliesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const ShowUserPageListReplies: FunctionComponent = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedPosts] = useInfiniteQuery(
    getUserRepliesInfinite,
    (page = { skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 16000,
    }
  )

  return (
    <StackList divider={<StackDivider />}>
      {groupedPosts.map((group) => {
        if (group.isEmpty) {
          return (
            <Box px={4}>
              <Alert key={"alert"} status={"info"}>
                <AlertIcon />
                {t("This user hasn't posted yet.")}
              </Alert>
            </Box>
          )
        }
        return group.posts.map((post) => {
          return <StackCardPost key={post.id} {...post} />
        })
      })}
    </StackList>
  )
}
