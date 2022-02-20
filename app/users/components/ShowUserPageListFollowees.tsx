import { Alert, AlertIcon, Box, StackDivider, useToast } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { BoxCardUser } from "app/users/components/BoxCardUser"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUserFollowees from "app/users/queries/getUserFollowees"
import { useInfiniteQuery, useMutation, useParam } from "blitz"
import React, { VFC } from "react"
import { useTranslation } from "react-i18next"

type Props = { userId: string | null }

export const ShowUserPageListFollowees: VFC<Props> = (props) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { setQueryData }] = useInfiniteQuery(
    getUserFollowees,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const [followUserMutation] = useMutation(followUser)

  const [unfollowUserMutation] = useMutation(unfollowUser)

  const toast = useToast()

  const friendships = pages.flatMap((page) => page.items)

  const onFollow = async (userId: string) => {
    try {
      await followUserMutation({ userId })
      for (const page of pages) {
        for (const followee of page.items) {
          if (followee.id !== userId) {
            continue
          }
          followee.isFollower = true
          await setQueryData(page)
        }
      }
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const onUnfollow = async (userId: string) => {
    try {
      await unfollowUserMutation({ userId })
      for (const page of pages) {
        for (const friendship of page.items) {
          if (friendship.id !== userId) {
            continue
          }
          friendship.isFollower = false
          await setQueryData(page)
        }
      }
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const isEmpty = friendships.length === 0

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
      {friendships.map((followee) => {
        return (
          <BoxCardUser
            key={followee.id}
            {...followee}
            hasAction={!!props.userId && props.userId !== followee.id}
            onFollow={() => onFollow(followee.id)}
            onUnfollow={() => onUnfollow(followee.id)}
            follower={followee}
          />
        )
      })}
    </StackList>
  )
}
