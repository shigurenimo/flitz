import { HStack, Stack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackCardQuotationEmbedded } from "app/posts/components/StackCardQuotationEmbedded"
import { StackHeaderRepost } from "app/posts/components/StackHeaderRepost"
import { StackHeaderUserAction } from "app/posts/components/StackHeaderUserAction"
import { StackPostActions } from "app/posts/components/StackPostActions"
import { StackPostDate } from "app/posts/components/StackPostDate"
import { StackPostImage } from "app/posts/components/StackPostImage"
import { StackPostReply } from "app/posts/components/StackPostReply"
import { StackPostText } from "app/posts/components/StackPostText"
import { useRouter } from "blitz"
import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"
import React, { FunctionComponent } from "react"

export const StackCardPost: FunctionComponent<
  QueryFeedPost & { isDisabled: boolean }
> = (props) => {
  const router = useRouter()

  const onPushRouter = () => {
    router.push(`/posts/${props.id}`)
  }

  const onClickQuotation = () => {
    router.push(`/posts/${props.quotation?.id}`)
  }

  if (props.quotation && props.text === null) {
    return (
      <StackCard onClick={() => onClickQuotation()}>
        <StackHeaderRepost name={props.user.name || props.user.username} />
        <HStack align={"start"} spacing={4}>
          <AvatarUser
            userId={props.quotation.user.id}
            fileId={props.quotation.user.iconImageId}
          />
          <Stack spacing={2} w={"full"}>
            <StackHeaderUserAction {...props.user} />
            <StackPostText text={props.quotation.text} />
            <StackPostImage fileIds={props.quotation.fileIds} />
            <StackPostDate createdAt={props.quotation.createdAt} />
            <StackPostActions
              hasLike={props.hasLike}
              hasQuotation={false}
              hasReply={props.hasReply}
              isDisabled={props.isDisabled}
              likesCount={props.quotation.likesCount}
              postId={props.id}
              quotationsCount={props.quotation.quotationsCount}
              repliesCount={props.quotation.repliesCount}
              text={props.quotation.text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  if (props.quotation) {
    return (
      <StackCard onClick={() => onPushRouter()}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
          <Stack spacing={2} w={"full"}>
            <StackHeaderUserAction {...props.user} />
            <StackPostReply {...props.quotation.user} />
            <StackPostText text={props.text} />
            <StackPostImage fileIds={props.fileIds} />
            <StackCardQuotationEmbedded {...props.quotation} />
            <StackPostDate createdAt={props.createdAt} />
            <StackPostActions
              hasLike={props.hasLike}
              hasQuotation={false}
              hasReply={props.hasReply}
              isDisabled={props.isDisabled}
              likesCount={props.likesCount}
              postId={props.id}
              quotationsCount={props.quotationsCount}
              repliesCount={props.repliesCount}
              text={props.quotation.text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  if (props.reply) {
    return (
      <StackCard onClick={() => router.push(`/posts/${props.reply?.id}`)}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
          <Stack spacing={2} w={"full"}>
            <StackHeaderUserAction {...props.user} />
            <StackPostReply {...props.reply.user} />
            <StackPostText text={props.text} />
            <StackPostImage fileIds={props.fileIds} />
            <StackPostDate createdAt={props.createdAt} />
            <StackPostActions
              hasLike={props.hasLike}
              hasQuotation={false}
              hasReply={props.hasReply}
              isDisabled={props.isDisabled}
              likesCount={props.likesCount}
              postId={props.id}
              quotationsCount={props.quotationsCount}
              repliesCount={props.repliesCount}
              text={props.text}
            />
          </Stack>
        </HStack>
      </StackCard>
    )
  }

  return (
    <StackCard onClick={() => onPushRouter()}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
        <Stack spacing={2} w={"full"}>
          <StackHeaderUserAction {...props.user} />
          <StackPostText text={props.text} />
          <StackPostImage fileIds={props.fileIds} />
          <StackPostDate createdAt={props.createdAt} />
          <StackPostActions
            hasLike={props.hasLike}
            hasQuotation={props.hasQuotation}
            hasReply={props.hasReply}
            isDisabled={props.isDisabled}
            likesCount={props.likesCount}
            postId={props.id}
            quotationsCount={props.quotationsCount}
            repliesCount={props.repliesCount}
            text={props.text}
          />
        </Stack>
      </HStack>
    </StackCard>
  )
}
