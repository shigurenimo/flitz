import { Stack, useToast } from "@chakra-ui/react"
import { StackProfileActions } from "app/users/components/StackProfileActions"
import { StackUserAction } from "app/users/components/StackUserAction"
import { StackUserFriendship } from "app/users/components/StackUserFriendship"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUser from "app/users/queries/getUser"
import { useMutation, useParam, useQuery, useRouter } from "blitz"
import React, { FunctionComponent, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const ShowUserPageDetail: FunctionComponent = () => {
  const router = useRouter()

  const username = useParam("username", "string")

  const [user, { setQueryData }] = useQuery(
    getUser,
    { username: username + "" },
    { refetchInterval: 1000 * 2 ** 5 }
  )

  const [followUserMutation, { isLoading: isLoadingFollowUser }] = useMutation(
    followUser
  )

  const [
    unfollowUserMutation,
    { isLoading: isLoadingUnfollowUser },
  ] = useMutation(unfollowUser)

  const toast = useToast()

  const onFollow = async () => {
    try {
      const updated = await followUserMutation({ userId: user.id })
      await setQueryData(updated)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const onUnfollow = async () => {
    try {
      const updated = await unfollowUserMutation({ userId: user.id })
      await setQueryData(updated)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const onExchange = () => {
    router.push(`/exchanges/-/${user.id}`)
  }

  return (
    <Stack spacing={4}>
      <StackProfileActions {...user} />
      <StackUserFriendship {...user} />
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={null}>
          <StackUserAction
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
