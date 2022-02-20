import { Alert, AlertIcon, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardUser } from "app/users/components/StackCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFollowers from "app/users/queries/getUserFollowers"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { VFC } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId: string | null }

export const ShowUserPageListFollowers: VFC<Props> = ({ userId }) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { setQueryData }] = useInfiniteQuery(
    getUserFollowers,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
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
        <StackCardUser
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
