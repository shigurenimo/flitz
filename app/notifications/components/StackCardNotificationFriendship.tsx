import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackCard } from "app/components/StackCard"
import React, { FunctionComponent } from "react"
import { FiUserPlus } from "react-icons/fi"

type Props = {
  createdAt: Date
  friendship: {
    follower: {
      biography: string
      id: string
      name: string | null
      username: string
    }
  }
}

export const StackCardNotificationFriendship: FunctionComponent<Props> = ({
  createdAt,
  friendship,
}) => {
  return (
    <StackCard>
      <HStack spacing={4}>
        <Stack>
          <AvatarGroup size={"md"}>
            <AvatarUser userId={friendship.follower.id} />
            <Avatar bg={"gray.100"} icon={<Icon as={FiUserPlus} />} />
          </AvatarGroup>
        </Stack>
        <HStack spacing={2}>
          <Text fontWeight={"bold"}>
            {friendship.follower.name || friendship.follower.username}
          </Text>
          <Text>{"followed you"}</Text>
        </HStack>
      </HStack>
    </StackCard>
  )
}
