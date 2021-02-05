import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackExchangeUser } from "app/exchanges/components/StackExchangeUser"
import { StackPostDate } from "app/posts/components/StackPostDate"
import React, { FunctionComponent } from "react"

type Props = {
  messages: {
    text: string
    createdAt: Date
    user: {
      id: string
      name: string | null
      username: string
    }
  }[]
  onClick: () => void
  relatedUser: {
    id: string
    name: string | null
    username: string
  } | null
}

export const StackCardExchange: FunctionComponent<Props> = ({
  messages,
  onClick,
  relatedUser,
}) => {
  const [message] = messages

  if (relatedUser === null) return null

  return (
    <StackCard onClick={onClick}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={relatedUser.id} />
        <Stack spacing={2} w={"full"}>
          <StackExchangeUser user={relatedUser} />
          <Text lineHeight={1}>{`${message.user.name} responded`}</Text>
          <Text fontSize={"lg"} lineHeight={1}>
            {message.text}
          </Text>
          <StackPostDate createdAt={message.createdAt} />
        </Stack>
      </HStack>
    </StackCard>
  )
}
