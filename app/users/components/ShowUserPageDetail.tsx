import { Heading, HStack, Link as LinkText, Stack, Text, useToast } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackUserAction } from "app/users/components/StackUserAction"
import followUser from "app/users/mutations/followUser"
import unfollowUser from "app/users/mutations/unfollowUser"
import getUser from "app/users/queries/getUser"
import { Link, useMutation, useParam, useQuery, useRouter } from "blitz"
import React, { FunctionComponent, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const ShowUserPageDetail: FunctionComponent = () => {
  const router = useRouter()

  const username = useParam("username", "string")

  const [user, { setQueryData }] = useQuery(
    getUser,
    { where: { username } },
    { refetchInterval: 8000 }
  )

  const [followUserMutation, { isLoading: isLoadingFollowUser }] = useMutation(followUser)

  const [unfollowUserMutation, { isLoading: isLoadingUnfollowUser }] = useMutation(unfollowUser)

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
    <Stack px={4} spacing={4}>
      <HStack spacing={4}>
        <AvatarUser userId={user.id} size={"xl"} />
        <Stack flex={1}>
          <Heading size={"lg"}>{user.name}</Heading>
          <Stack spacing={0}>
            <Text fontSize={"md"}>{`@${user.username}`}</Text>
          </Stack>
        </Stack>
      </HStack>
      <Stack pacing={2}>
        <Stack>
          <Text fontWeight={"bold"}>{user.biography}</Text>
        </Stack>
        <HStack align={"center"} spacing={2}>
          <Text color={"gray.500"} fontSize={"sm"}>
            {"CreatedAt"}
          </Text>
          <Text color={"gray.500"} fontSize={"sm"}>
            {user.createdAt.toDateString()}
          </Text>
        </HStack>
        <HStack align={"center"} spacing={4}>
          <Link href={`/${username}/followees`} passHref>
            <LinkText color={"gray.500"} fontWeight={"bold"}>
              {`${user.followeesCount} Following`}
            </LinkText>
          </Link>
          <Link href={`/${username}/followers`} passHref>
            <LinkText color={"gray.500"} fontWeight={"bold"}>
              {`${user.followersCount} Followers`}
            </LinkText>
          </Link>
        </HStack>
      </Stack>
      <ErrorBoundary FallbackComponent={() => null}>
        <Suspense fallback={null}>
          <StackUserAction
            hasRelationship={user.followers && user.followers.length !== 0}
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
