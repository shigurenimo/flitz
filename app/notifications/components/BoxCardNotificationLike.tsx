import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxCard } from "app/core/components/BoxCard"
import { AppNotificationLike } from "integrations/interface/types/appNotificationLike"
import React, { VFC } from "react"
import { FiHeart } from "react-icons/fi"

type Props = AppNotificationLike

export const BoxCardNotificationLike: VFC<Props> = (props) => {
  return (
    <BoxCard spacing={4}>
      <HStack spacing={4}>
        <Stack>
          <AvatarGroup size={"md"}>
            <AvatarUser userId={props.embedded.user.id} />
            <Avatar bg={"gray.100"} icon={<Icon as={FiHeart} />} />
          </AvatarGroup>
        </Stack>
        <HStack spacing={2}>
          <Text fontWeight={"bold"}>
            {props.embedded.user.name || props.embedded.user.username}
          </Text>
          <Text>{"liked your post"}</Text>
        </HStack>
      </HStack>
      <Stack>
        {/**
        <StackCardQuotationEmbedded {...props} />
        */}
      </Stack>
    </BoxCard>
  )
}
