import { Alert, AlertIcon, StackDivider, useToast } from "@chakra-ui/react"
import { StackList } from "app/components/StackList"
import { StackCardUser } from "app/users/components/StackCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFollowersInfinite from "app/users/queries/getUserFollowersInfinite"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId?: string }

export const ShowUserPageListFollowers: FunctionComponent<Props> = ({
  userId,
}) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedFriendships, { setQueryData }] = useInfiniteQuery(
    getUserFollowersInfinite,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const [followUserMutation] = useMutation(followUser)

  const [unfollowUserMutation] = useMutation(unfollowUser)

  const toast = useToast()

  const onFollow = async (userId: string) => {
    const updated = await followUserMutation({ userId })
    for (const groupedFriendship of groupedFriendships) {
      for (const friendship of groupedFriendship.friendships) {
        if (friendship.followeeId !== userId) {
          continue
        }
        friendship.follower.followers = updated.followers
        await setQueryData(groupedFriendship)
      }
    }
  }

  const onUnfollow = async (userId: string) => {
    const updated = await unfollowUserMutation({ userId })
    for (const groupedFriendship of groupedFriendships) {
      for (const friendship of groupedFriendship.friendships) {
        if (friendship.followeeId !== userId) {
          continue
        }
        friendship.follower.followers = updated.followers
        await setQueryData(groupedFriendship)
      }
    }
  }

  const [group] = groupedFriendships

  const isEmpty = group.friendships.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Alert status={"info"}>
          <AlertIcon />
          {t("No Followers")}
        </Alert>
      )}
      {groupedFriendships.map((group) => {
        return group.friendships.map((friendship) => {
          return (
            <StackCardUser
              {...friendship}
              hasAction={!!userId && userId !== friendship.followerId}
              onFollow={() => onFollow(friendship.followerId)}
              onUnfollow={() => onUnfollow(friendship.followerId)}
              user={friendship.follower}
            />
          )
        })
      })}
    </StackList>
  )
}
