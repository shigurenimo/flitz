import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { AppNotificationFollow } from "integrations/interface/types/appNotificationFollow"
import React, { FunctionComponent } from "react"
import { FiUserPlus } from "react-icons/fi"

export const StackCardNotificationFriendship: FunctionComponent<AppNotificationFollow> = (
  props
) => {
  return (
    <StackCard>
      <HStack spacing={4}>
        <Stack>
          <AvatarGroup size={"md"}>
            <AvatarUser
              userId={props.embedded.id}
              fileId={props.embedded.iconImageId}
            />
            <Avatar bg={"gray.100"} icon={<Icon as={FiUserPlus} />} />
          </AvatarGroup>
        </Stack>
        <HStack spacing={2}>
          <Text fontWeight={"bold"}>
            {props.embedded.name || props.embedded.username}
          </Text>
          <Text>{"followed you"}</Text>
        </HStack>
      </HStack>
    </StackCard>
  )
}
