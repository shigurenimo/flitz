import { HStack, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackCard } from "app/components/StackCard"
import { StackCardQuotationEmbedded } from "app/posts/components/StackCardQuotationEmbedded"
import { StackPostActions } from "app/posts/components/StackPostActions"
import { StackPostDate } from "app/posts/components/StackPostDate"
import { StackPostUser } from "app/posts/components/StackPostUser"
import { useRouter } from "blitz"
import React, { FunctionComponent } from "react"
import { FiRepeat } from "react-icons/fi"

type Props = {
  createdAt: Date
  id: string
  isDisabled?: boolean
  likesCount: number
  likes?: {
    userId: string
  }[]
  quotation?: {
    createdAt: Date
    id: string
    likesCount
    likes?: {
      userId: string
    }[]
    quotations?: {
      userId: string
    }[]
    quotationsCount: number
    replies?: {
      userId: string
    }[]
    repliesCount: number
    text: string | null
    user: {
      id: string
      name: string | null
      username: string | null
    }
    userId: string
  } | null
  quotations?: {
    userId: string
  }[]
  quotationsCount: number
  replies?: {
    userId: string
  }[]
  reply?: {
    createdAt: Date
    id: string
    likesCount
    likes?: {
      userId: string
    }[]
    quotations?: {
      userId: string
    }[]
    quotationsCount: number
    replies?: {
      userId: string
    }[]
    repliesCount: number
    text: string | null
    user: {
      id: string
      name: string | null
      username: string | null
    }
    userId: string
  } | null
  repliesCount: number
  text: string | null
  user: {
    id: string
    name: string | null
    username: string | null
  }
  userId: string
}

export const StackCardPost: FunctionComponent<Props> = ({
  createdAt,
  id,
  isDisabled = false,
  likes,
  likesCount,
  quotation,
  quotations,
  quotationsCount,
  replies,
  repliesCount,
  reply,
  text,
  user,
  userId,
}) => {
  const bg = useColorModeValue("purple.50", "gray.600")

  const router = useRouter()

  const onPushRouter = () => {
    router.push(`/posts/${id}`)
  }

  const onClickQuotation = () => {
    router.push(`/posts/${quotation?.id}`)
  }

  if (quotation && text === null) {
    return (
      <StackCard onClick={() => onClickQuotation()}>
        <HStack>
          <HStack bg={bg} px={4} py={1} rounded={"md"}>
            <Icon as={FiRepeat} />
            <Text fontWeight={"bold"} fontSize={"sm"}>{`${user.name} Reposted`}</Text>
          </HStack>
        </HStack>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={quotation.userId} />
          <Stack spacing={2} w={"full"}>
            <StackPostUser user={quotation.user} />
            {quotation.text && (
              <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
                {quotation.text}
              </Text>
            )}
            <StackPostDate createdAt={quotation.createdAt} />
            <StackPostActions
              hasLike={!!quotation.likes && 0 < quotation.likes.length}
              hasQuotation={false}
              hasReply={!!quotation.replies && 0 < quotation.replies.length}
              isDisabled={isDisabled}
              likesCount={quotation.likesCount}
              postId={id}
              quotationsCount={quotation.quotationsCount}
              repliesCount={quotation.repliesCount}
              text={quotation.text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  if (quotation) {
    return (
      <StackCard onClick={() => onPushRouter()}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={userId} />
          <Stack spacing={2} w={"full"}>
            <StackPostUser user={user} />
            <Text color={"primary.500"} fontWeight={"bold"} fontSize={"sm"} lineHeight={1}>
              {`Replying to @${quotation.user.username}`}
            </Text>
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
              {text}
            </Text>
            <StackCardQuotationEmbedded {...quotation} />
            <StackPostDate createdAt={createdAt} />
            <StackPostActions
              hasLike={!!likes && 0 < likes.length}
              hasQuotation={false}
              hasReply={!!replies && 0 < replies.length}
              isDisabled={isDisabled}
              likesCount={likesCount}
              postId={id}
              quotationsCount={quotationsCount}
              repliesCount={repliesCount}
              text={quotation.text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  if (reply) {
    return (
      <StackCard
        onClick={() => {
          router.push(`/posts/${reply.id}`)
        }}
      >
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={userId} />
          <Stack spacing={2} w={"full"}>
            <StackPostUser user={user} />
            <Text color={"primary.500"} fontWeight={"bold"} fontSize={"sm"} lineHeight={1}>
              {`Replying to @${reply.user.username}`}
            </Text>
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
              {text}
            </Text>
            <StackPostDate createdAt={createdAt} />
            <StackPostActions
              hasLike={!!likes && 0 < likes.length}
              hasQuotation={false}
              hasReply={!!replies && 0 < replies.length}
              isDisabled={isDisabled}
              likesCount={likesCount}
              postId={id}
              quotationsCount={quotationsCount}
              repliesCount={repliesCount}
              text={text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  return (
    <StackCard onClick={() => onPushRouter()}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={userId} />
        <Stack spacing={2} w={"full"}>
          <StackPostUser user={user} />
          {text && (
            <Text fontSize={"xl"} fontWeight={"bold"} lineHeight={1}>
              {text}
            </Text>
          )}
          <StackPostDate createdAt={createdAt} />
          <StackPostActions
            hasLike={!!likes && 0 < likes.length}
            hasQuotation={!!quotations && 0 < quotations.length}
            hasReply={!!replies && 0 < replies.length}
            isDisabled={isDisabled}
            likesCount={likesCount}
            postId={id}
            quotationsCount={quotationsCount}
            repliesCount={repliesCount}
            text={text}
          />
        </Stack>
      </HStack>
    </StackCard>
  )
}
