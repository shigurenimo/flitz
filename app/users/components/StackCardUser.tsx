import { Badge, Button, HStack, Stack, Text, useToast } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackCard } from "app/components/StackCard"
import { useRouter } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  createdAt: Date
  hasAction: boolean
  onFollow: () => Promise<void>
  onUnfollow: () => Promise<void>
  user: {
    biography: string
    followees: {
      id: string
    }[]
    followers: {
      id: string
    }[]
    id: string
    name: string | null
    username: string | null
  }
}

export const StackCardUser: FunctionComponent<Props> = ({
  hasAction,
  onFollow,
  onUnfollow,
  user,
}) => {
  const router = useRouter()

  const toast = useToast()

  const onShowUser = () => {
    router.push(`/${user.username}`)
  }

  const onRunFollow = async () => {
    try {
      await onFollow()
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const onRunUnfollow = async () => {
    try {
      await onUnfollow()
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const isFollowee = user.followers.length !== 0

  const isFollower = user.followees.length !== 0

  return (
    <StackCard onClick={() => onShowUser()}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={user.id} />
        <Stack spacing={2} w={"full"}>
          <HStack align={"start"} spacing={4}>
            <Stack spacing={2} w={"full"}>
              <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
                {user.name}
              </Text>
              <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
                {`@${user.username || user.id}`}
              </Text>
            </Stack>
            {hasAction && (
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  if (isFollowee) {
                    return onRunUnfollow()
                  }
                  return onRunFollow()
                }}
              >
                {isFollowee ? "Following" : "Follow"}
              </Button>
            )}
          </HStack>
          {isFollower && (
            <HStack>
              <Badge colorScheme={"green"}>{"Follows you"}</Badge>
            </HStack>
          )}
          <Text fontSize={"lg"} fontWeight={"bold"} lineHeight={1.5}>
            {user.biography}
          </Text>
        </Stack>
      </HStack>
    </StackCard>
  )
}
