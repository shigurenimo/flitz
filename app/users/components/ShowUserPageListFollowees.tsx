import { Alert, AlertIcon, Box, StackDivider, useToast } from "@chakra-ui/react"
import { StackList } from "app/components/StackList"
import { StackCardUser } from "app/users/components/StackCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFolloweesInfinite from "app/users/queries/getUserFolloweesInfinite"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId?: string }

export const ShowUserPageListFollowees: FunctionComponent<Props> = ({
  userId,
}) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedFriendships, { setQueryData }] = useInfiniteQuery(
    getUserFolloweesInfinite,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 16000,
    }
  )

  const [followUserMutation, { isLoading: isLoadingFollowUser }] = useMutation(
    followUser
  )

  const [
    unfollowUserMutation,
    { isLoading: isLoadingUnfollowUser },
  ] = useMutation(unfollowUser)

  const toast = useToast()

  const onFollow = async (userId: string) => {
    try {
      const updated = await followUserMutation({ userId })
      for (const groupedFriendship of groupedFriendships) {
        for (const friendship of groupedFriendship.friendships) {
          if (friendship.followeeId !== userId) {
            continue
          }
          friendship.followee.followers = updated.followers
          await setQueryData(groupedFriendship)
        }
      }
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const onUnfollow = async (userId: string) => {
    try {
      const updated = await unfollowUserMutation({ userId })
      for (const groupedFriendship of groupedFriendships) {
        for (const friendship of groupedFriendship.friendships) {
          if (friendship.followeeId !== userId) {
            continue
          }
          friendship.followee.followers = updated.followers
          await setQueryData(groupedFriendship)
        }
      }
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const [group] = groupedFriendships

  const isEmpty = group.friendships.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Box px={4}>
          <Alert status={"info"}>
            <AlertIcon />
            {t("No Followees")}
          </Alert>
        </Box>
      )}
      {groupedFriendships.map((group) => {
        return group.friendships.map((friendship) => {
          return (
            <StackCardUser
              {...friendship}
              hasAction={!!userId && userId !== friendship.followeeId}
              onFollow={() => onFollow(friendship.followee.id)}
              onUnfollow={() => onUnfollow(friendship.followee.id)}
              user={friendship.followee}
            />
          )
        })
      })}
    </StackList>
  )
}
