import { Alert, AlertIcon, StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardUser } from "app/users/components/StackCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFollowersInfinite from "app/users/queries/getUserFollowersInfinite"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId: string | null }

export const ShowUserPageListFollowers: FunctionComponent<Props> = ({
  userId,
}) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedFollowers, { setQueryData }] = useInfiniteQuery(
    getUserFollowersInfinite,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const [followUserMutation] = useMutation(followUser)

  const [unfollowUserMutation] = useMutation(unfollowUser)

  const onFollow = async (userId: string) => {
    await followUserMutation({ userId })
    for (const groupedFriendship of groupedFollowers) {
      for (const follower of groupedFriendship.friendships) {
        if (follower.id !== userId) {
          continue
        }
        follower.isFollowee = true
        await setQueryData(groupedFriendship)
      }
    }
  }

  const onUnfollow = async (userId: string) => {
    await unfollowUserMutation({ userId })
    for (const groupedFriendship of groupedFollowers) {
      for (const follower of groupedFriendship.friendships) {
        if (follower.id !== userId) {
          continue
        }
        follower.isFollowee = false
        await setQueryData(groupedFriendship)
      }
    }
  }

  const [group] = groupedFollowers

  const isEmpty = group.friendships.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Alert status={"info"}>
          <AlertIcon />
          {t("No Followers")}
        </Alert>
      )}
      {groupedFollowers.map((group) => {
        return group.friendships.map((follower) => {
          return (
            <StackCardUser
              {...follower}
              hasAction={!!userId && userId !== follower.id}
              onFollow={() => onFollow(follower.id)}
              onUnfollow={() => onUnfollow(follower.id)}
              follower={follower}
            />
          )
        })
      })}
    </StackList>
  )
}
