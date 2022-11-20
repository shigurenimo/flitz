import { Badge, Button, HStack, Stack, Text, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { AppFriendship } from "infrastructure/models/appFriendship"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"

type Props = {
  createdAt: Date
  hasAction: boolean
  onFollow: () => Promise<void>
  onUnfollow: () => Promise<void>
  follower: AppFriendship
}

export const BoxCardUser: FC<Props> = (props) => {
  const router = useRouter()

  const toast = useToast()

  const onShowUser = () => {
    router.push(`/${props.follower.username}`)
  }

  const onRunFollow = async () => {
    try {
      await props.onFollow()
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const onRunUnfollow = async () => {
    try {
      await props.onUnfollow()
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  return (
    <BoxCard onClick={() => onShowUser()}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.follower.id} />
        <Stack spacing={2} w={"full"}>
          <HStack align={"start"} spacing={4}>
            <Stack spacing={2} w={"full"}>
              <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
                {props.follower.name}
              </Text>
              <Text color={"gray.500"} fontSize={"sm"} lineHeight={1}>
                {`@${props.follower.username || props.follower.id}`}
              </Text>
            </Stack>
            {props.hasAction && (
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  if (props.follower.isFollowee) {
                    return onRunUnfollow()
                  }
                  return onRunFollow()
                }}
              >
                {props.follower.isFollowee ? "Following" : "Follow"}
              </Button>
            )}
          </HStack>
          {props.follower.isFollower && (
            <HStack>
              <Badge colorScheme={"green"}>{"Follows you"}</Badge>
            </HStack>
          )}
          <Text fontSize={"lg"} fontWeight={"bold"} lineHeight={1.5}>
            {props.follower.biography}
          </Text>
        </Stack>
      </HStack>
    </BoxCard>
  )
}
