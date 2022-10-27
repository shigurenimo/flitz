import { useParam } from "@blitzjs/next"
import { useInfiniteQuery, useMutation } from "@blitzjs/rpc"
import { Alert, AlertIcon, Box, StackDivider, useToast } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import followUser from "integrations/mutations/followUser"
import unfollowUser from "integrations/mutations/unfollowUser"
import getUserFollowees from "integrations/queries/getUserFollowees"
import { StackList } from "interface/core/components/StackList"
import { BoxCardUser } from "interface/users/components/BoxCardUser"

type Props = { userId: string | null }

export const ShowUserPageListFollowees: FC<Props> = (props) => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { setQueryData }] = useInfiniteQuery(
    getUserFollowees,
    (page = { take: 80, skip: 0, username }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
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
