import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { useInfiniteQuery, useParam } from "blitz"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { StackList } from "app/core/components/StackList"
import { BoxCardPost } from "app/posts/components/BoxCardPost"
import getUserLikes from "app/users/queries/getUserLikes"

export const ShowUserPageListLikes: FC = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { isFetching }] = useInfiniteQuery(
    getUserLikes,
    (page = { skip: 0, username }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  const isEmpty = !isFetching && posts.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Box key={"empty"} px={4}>
          <Alert key={"alert"} status={"info"}>
            <AlertIcon />
            {t("This user hasn't posted yet.")}
          </Alert>
        </Box>
      )}
      {posts.map((post) => {
        return <BoxCardPost key={post.id} {...post} isDisabled={false} />
      })}
    </StackList>
  )
}
