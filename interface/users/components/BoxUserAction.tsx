import { useSession } from "@blitzjs/auth"
import { Button, HStack, Icon } from "@chakra-ui/react"
import { FC } from "react"
import { FiMail, FiUserCheck, FiUserPlus } from "react-icons/fi"

type Props = {
  hasRelationship: boolean
  isLoading: boolean
  onExchange(): void
  onFollow(): void
  onUnfollow(): void
  userId: string
}

export const BoxUserAction: FC<Props> = (props) => {
  const session = useSession()

  if (session.userId === props.userId) {
    return null
  }

  return (
    <HStack spacing={4} px={4}>
      <Button
        leftIcon={
          <Icon
            display={"flex"}
            as={props.hasRelationship ? FiUserCheck : FiUserPlus}
          />
        }
        isLoading={props.isLoading}
        loadingText={props.hasRelationship ? "Following" : "Follow"}
        onClick={props.hasRelationship ? props.onUnfollow : props.onFollow}
      >
        {props.hasRelationship ? "Following" : "Follow"}
      </Button>
      <Button
        leftIcon={<Icon display={"flex"} as={FiMail} />}
        onClick={props.onExchange}
      >
        {"Message"}
      </Button>
    </HStack>
  )
}
