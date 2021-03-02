import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackExchangeUser } from "app/exchanges/components/StackExchangeUser"
import { StackPostDate } from "app/posts/components/StackPostDate"
import { QueryUserExchange } from "integrations/interface/types/queryExchangeMessage"
import React, { FunctionComponent } from "react"

export const StackCardExchange: FunctionComponent<
  QueryUserExchange & {
    onClick: () => void
  }
> = (props) => {
  if (props.relatedUser === null) return null

  return (
    <StackCard onClick={props.onClick}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.relatedUser.id} />
        <Stack spacing={2} w={"full"}>
          <StackExchangeUser user={props.relatedUser} />
          <Text lineHeight={1}>{`${props.relatedUser.name} responded`}</Text>
          <Text fontSize={"lg"} lineHeight={1}>
            {props.lastMessage.text}
          </Text>
          <StackPostDate createdAt={props.lastMessage.createdAt} />
        </Stack>
      </HStack>
    </StackCard>
  )
}
