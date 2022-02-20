import { Stack, useToast } from "@chakra-ui/react"
import { BoxProfileActions } from "app/users/components/BoxProfileActions"
import { BoxUserAction } from "app/users/components/BoxUserAction"
import { BoxUserFriendship } from "app/users/components/BoxUserFriendship"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUser from "app/users/queries/getUser"
import { useMutation, useParam, useQuery, useRouter } from "blitz"
import React, { Suspense, VFC } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const ShowUserPageDetail: VFC = () => {
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

  const onExchange = () => {
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
            onExchange={onExchange}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            userId={user.id}
          />
        </Suspense>
      </ErrorBoundary>
    </Stack>
  )
}
