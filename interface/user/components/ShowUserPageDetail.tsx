import { ErrorBoundary, useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Stack, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC, Suspense } from "react"
import followUser from "app/mutations/followUser"
import unfollowUser from "app/mutations/unfollowUser"
import getUser from "app/queries/getUser"
import { BoxProfileActions } from "interface/user/components/BoxProfileActions"
import { BoxUserAction } from "interface/user/components/BoxUserAction"
import { BoxUserFriendship } from "interface/user/components/BoxUserFriendship"

export const ShowUserPageDetail: FC = () => {
  const router = useRouter()

  const username = useParam("username", "string")

  const [user, { setQueryData }] = useQuery(
    getUser,
    { username: username + "" },
    { refetchInterval: 1000 * 2 ** 5 }
  )

  const [followUserMutation, { isLoading: isLoadingFollowUser }] =
    useMutation(followUser)

  const [unfollowUserMutation, { isLoading: isLoadingUnfollowUser }] =
    useMutation(unfollowUser)

  const toast = useToast()

  const onFollow = async () => {
    try {
      const updated = await followUserMutation({ userId: user.id })
      await setQueryData(updated)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const onUnfollow = async () => {
    try {
      const updated = await unfollowUserMutation({ userId: user.id })
      await setQueryData(updated)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const onSendMessage = () => {
    router.push(`/exchanges/-/${user.id}`)
  }

  return (
    <Stack spacing={4}>
      <BoxProfileActions {...user} />
      <BoxUserFriendship {...user} />
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={null}>
          <BoxUserAction
            hasRelationship={user.isFollowee}
            isLoading={isLoadingFollowUser || isLoadingUnfollowUser}
            onSendMessage={onSendMessage}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            userId={user.id}
          />
        </Suspense>
      </ErrorBoundary>
    </Stack>
  )
}
