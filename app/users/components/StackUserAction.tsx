import { Button, HStack, Icon } from "@chakra-ui/react"
import { useSession } from "blitz"
import React, { VFC } from "react"
import { FiMail, FiUserCheck, FiUserPlus } from "react-icons/fi"

type Props = {
  hasRelationship: boolean
  isLoading: boolean
  onExchange: () => void
  onFollow: () => void
  onUnfollow: () => void
  userId: string
}

export const StackUserAction: VFC<Props> = ({
  hasRelationship,
  isLoading,
  onExchange,
  onFollow,
  onUnfollow,
  userId,
}) => {
  const session = useSession()

  if (session.userId === userId) {
    return null
  }

  return (
    <HStack spacing={4} px={4}>
      <Button
        leftIcon={
          <Icon
            display={"flex"}
            as={hasRelationship ? FiUserCheck : FiUserPlus}
          />
        }
        isLoading={isLoading}
        loadingText={hasRelationship ? "Following" : "Follow"}
        onClick={hasRelationship ? onUnfollow : onFollow}
      >
        {hasRelationship ? "Following" : "Follow"}
      </Button>
      <Button
        leftIcon={<Icon display={"flex"} as={FiMail} />}
        onClick={onExchange}
      >
        {"Message"}
      </Button>
    </HStack>
  )
}
