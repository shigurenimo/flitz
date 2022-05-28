import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxCard } from "app/core/components/BoxCard"
import { BoxExchangeUser } from "app/exchanges/components/BoxExchangeUser"
import { BoxPostDate } from "app/posts/components/BoxPostDate"
import { AppMessageThread } from "integrations/interface/types/appMessageThread"
import { FC } from "react"

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
