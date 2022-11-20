import { useSession } from "@blitzjs/auth"
import { Button, HStack, Icon } from "@chakra-ui/react"
import { FC } from "react"
import { FiMail, FiUserPlus } from "react-icons/fi"

type Props = {
  hasRelationship: boolean
  isLoading: boolean
  onSendMessage(): void
  onFollow(): void
  onUnfollow(): void
  userId: string
}

export const BoxFriendshipActions: FC<Props> = (props) => {
  const session = useSession()

  if (session.userId === props.userId) {
    return null
  }

  return (
    <HStack spacing={4}>
      <Button
        leftIcon={<Icon display={"flex"} as={FiUserPlus} />}
        isLoading={props.isLoading}
        loadingText={props.hasRelationship ? "Following" : "Follow"}
        onClick={props.hasRelationship ? props.onUnfollow : props.onFollow}
      >
        {"Following"}
      </Button>
      <Button
        isLoading={props.isLoading}
        leftIcon={<Icon display={"flex"} as={FiMail} />}
        loadingText={"Following"}
        onClick={props.onSendMessage}
      >
        {"Message"}
      </Button>
    </HStack>
  )
}
