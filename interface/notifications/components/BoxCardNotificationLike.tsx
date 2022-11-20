import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FC } from "react"
import { FiHeart } from "react-icons/fi"
import { AppNotificationLike } from "infrastructure/models/appNotificationLike"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"

type Props = AppNotificationLike

export const BoxCardNotificationLike: FC<Props> = (props) => {
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
