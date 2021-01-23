import { HStack, Stack } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackCard } from "app/components/StackCard"
import { StackCardQuotationEmbedded } from "app/posts/components/StackCardQuotationEmbedded"
import { StackHeaderRepost } from "app/posts/components/StackHeaderRepost"
import { StackHeaderUserAction } from "app/posts/components/StackHeaderUserAction"
import { StackPostActions } from "app/posts/components/StackPostActions"
import { StackPostDate } from "app/posts/components/StackPostDate"
import { StackPostImage } from "app/posts/components/StackPostImage"
import { StackPostReply } from "app/posts/components/StackPostReply"
import { StackPostText } from "app/posts/components/StackPostText"
import { useRouter } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  createdAt: Date
  files?: { id: string }[]
  id: string
  isDisabled?: boolean
  likesCount: number
  likes?: {
    userId: string
  }[]
  quotation?: {
    createdAt: Date
    files?: { id: string }[]
    id: string
    likesCount: number
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
      username: string
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
    files?: { id: string }[]
    id: string
    likesCount: number
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
      username: string
    }
    userId: string
  } | null
  repliesCount: number
  text: string | null
  user: {
    id: string
    name: string | null
    username: string
  }
  userId: string
}

export const StackCardPost: FunctionComponent<Props> = ({
  createdAt,
  files,
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
        <StackHeaderRepost name={user.name || user.username} />
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={quotation.userId} />
          <Stack spacing={2} w={"full"}>
            <StackHeaderUserAction {...user} />
            <StackPostText text={quotation.text} />
            <StackPostImage files={quotation.files} />
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
            <StackHeaderUserAction {...user} />
            <StackPostReply {...quotation.user} />
            <StackPostText text={text} />
            <StackPostImage files={files} />
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
      <StackCard onClick={() => router.push(`/posts/${reply.id}`)}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={userId} />
          <Stack spacing={2} w={"full"}>
            <StackHeaderUserAction {...user} />
            <StackPostReply {...reply.user} />
            <StackPostText text={text} />
            <StackPostImage files={files} />
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
          <StackHeaderUserAction {...user} />
          <StackPostText text={text} />
          <StackPostImage files={files} />
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
