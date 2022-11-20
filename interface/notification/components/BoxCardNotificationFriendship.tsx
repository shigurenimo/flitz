import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FC } from "react"
import { FiUserPlus } from "react-icons/fi"
import { AppNotificationFollow } from "infrastructure/models/appNotificationFollow"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"

type Props = AppNotificationFollow

export const BoxCardNotificationFriendship: FC<Props> = (props) => {
  return (
    <BoxCard>
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
    </BoxCard>
  )
}
