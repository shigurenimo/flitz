import { HStack, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import { AppMessageThread } from "infrastructure/models/appMessageThread"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"
import { BoxExchangeUser } from "interface/message/components/BoxExchangeUser"
import { BoxPostDate } from "interface/posts/components/BoxPostDate"

type Props = AppMessageThread & {
  onClick(): void
}

export const BoxCardExchange: FC<Props> = (props) => {
  if (props.relatedUser === null) {
    return null
  }

  return (
    <BoxCard onClick={props.onClick}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.relatedUser.id} />
        <Stack spacing={2} w={"full"}>
          <BoxExchangeUser user={props.relatedUser} />
          <Text lineHeight={1}>{`${props.relatedUser.name} responded`}</Text>
          <Text fontSize={"lg"} lineHeight={1}>
            {props.lastMessage.text}
          </Text>
          <BoxPostDate createdAt={props.lastMessage.createdAt} />
        </Stack>
      </HStack>
    </BoxCard>
  )
}
