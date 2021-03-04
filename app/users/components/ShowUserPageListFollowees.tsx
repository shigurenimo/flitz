import { Alert, AlertIcon, Box, StackDivider, useToast } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardUser } from "app/users/components/StackCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFolloweesInfinite from "app/users/queries/getUserFolloweesInfinite"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId: string | null }

export const ShowUserPageListFollowees: FunctionComponent<Props> = ({
  userId,
}) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [groupedFollowees, { setQueryData }] = useInfiniteQuery(
    getUserFolloweesInfinite,
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
    try {
      await followUserMutation({ userId })
      for (const groupedFriendship of groupedFollowees) {
        for (const followee of groupedFriendship.friendships) {
          if (followee.id !== userId) {
            continue
          }
          followee.isFollower = true
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
      await unfollowUserMutation({ userId })
      for (const groupedFriendship of groupedFollowees) {
        for (const friendship of groupedFriendship.friendships) {
          if (friendship.id !== userId) {
            continue
          }
          friendship.isFollower = false
          await setQueryData(groupedFriendship)
        }
      }
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const [group] = groupedFollowees

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
      {groupedFollowees.map((group) => {
        return group.friendships.map((followee) => {
          return (
            <StackCardUser
              {...followee}
              hasAction={!!userId && userId !== followee.id}
              onFollow={() => onFollow(followee.id)}
              onUnfollow={() => onUnfollow(followee.id)}
              follower={followee}
            />
          )
        })
      })}
    </StackList>
  )
}
