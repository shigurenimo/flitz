import { useParam } from "@blitzjs/next"
import { useInfiniteQuery, useMutation } from "@blitzjs/rpc"
import { Alert, AlertIcon, StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import followUser from "app/mutations/followUser"
import unfollowUser from "app/mutations/unfollowUser"
import getUserFollowers from "app/queries/getUserFollowers"
import { StackList } from "interface/core/components/StackList"
import { BoxCardUser } from "interface/users/components/BoxCardUser"

type Props = { userId: string | null }

export const ShowUserPageListFollowers: FC<Props> = ({ userId }) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { setQueryData }] = useInfiniteQuery(
    getUserFollowers,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const [followUserMutation] = useMutation(followUser)

  const [unfollowUserMutation] = useMutation(unfollowUser)

  const friendships = pages.flatMap((page) => page.items)

  const onFollow = async (userId: string) => {
    await followUserMutation({ userId })
    for (const page of pages) {
      for (const follower of page.items) {
        if (follower.id !== userId) {
          continue
        }
        follower.isFollowee = true
        await setQueryData(page)
      }
    }
  }

  const onUnfollow = async (userId: string) => {
    await unfollowUserMutation({ userId })
    for (const page of pages) {
      for (const follower of page.items) {
        if (follower.id !== userId) {
          continue
        }
        follower.isFollowee = false
        await setQueryData(page)
      }
    }
  }

  const isEmpty = friendships.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Alert status={"info"}>
          <AlertIcon />
          {t("No Followers")}
        </Alert>
      )}
      {friendships.map((follower) => (
        <BoxCardUser
          key={follower.id}
          {...follower}
          hasAction={!!userId && userId !== follower.id}
          onFollow={() => onFollow(follower.id)}
          onUnfollow={() => onUnfollow(follower.id)}
          follower={follower}
        />
      ))}
    </StackList>
  )
}
