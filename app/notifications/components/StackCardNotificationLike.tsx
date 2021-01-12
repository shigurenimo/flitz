import { Avatar, AvatarGroup, HStack, Icon, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackCard } from "app/components/StackCard"
import { StackCardQuotationEmbedded } from "app/posts/components/StackCardQuotationEmbedded"
import React, { FunctionComponent } from "react"
import { FiHeart } from "react-icons/fi"

type Props = {
  createdAt: Date
  like: {
    post: {
      createdAt: Date
      id: string
      text: string | null
      userId: string
      user: {
        name: string | null
        username: string | null
      }
    }
    user: {
      biography: string
      id: string
      name: string | null
      username: string
    }
  }
}

export const StackCardNotificationLike: FunctionComponent<Props> = ({ createdAt, like }) => {
  return (
    <StackCard spacing={4}>
      <HStack spacing={4}>
        <Stack>
          <AvatarGroup size={"md"}>
            <AvatarUser userId={like.user.id} />
            <Avatar bg={"gray.100"} icon={<Icon as={FiHeart} />} />
          </AvatarGroup>
        </Stack>
        <HStack spacing={2}>
          <Text fontWeight={"bold"}>{like.user.name || like.user.username}</Text>
          <Text>{"liked your post"}</Text>
        </HStack>
      </HStack>
      <Stack>
        <StackCardQuotationEmbedded {...like.post} />
      </Stack>
    </StackCard>
  )
}
