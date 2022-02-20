import { HStack, Stack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxCard } from "app/core/components/BoxCard"
import { BoxCardQuotationEmbedded } from "app/posts/components/BoxCardQuotationEmbedded"
import { BoxHeaderRepost } from "app/posts/components/BoxHeaderRepost"
import { BoxHeaderUserAction } from "app/posts/components/BoxHeaderUserAction"
import { BoxPostActions } from "app/posts/components/BoxPostActions"
import { BoxPostDate } from "app/posts/components/BoxPostDate"
import { BoxPostImage } from "app/posts/components/BoxPostImage"
import { BoxPostReply } from "app/posts/components/BoxPostReply"
import { TextPost } from "app/posts/components/TextPost"
import { useRouter } from "blitz"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import React, { VFC } from "react"

type Props = AppFeedPost & { isDisabled: boolean }

export const BoxCardPost: VFC<Props> = (props) => {
  const router = useRouter()

  const onPushRouter = () => {
    router.push(`/posts/${props.id}`)
  }

  const onClickQuotation = () => {
    router.push(`/posts/${props.quotation?.id}`)
  }

  if (props.quotation && props.text === null) {
    return (
      <BoxCard onClick={() => onClickQuotation()}>
        <BoxHeaderRepost name={props.user.name || props.user.username} />
        <HStack align={"start"} spacing={4}>
          <AvatarUser
            userId={props.quotation.user.id}
            fileId={props.quotation.user.iconImageId}
          />
          <Stack spacing={2} w={"full"}>
            <BoxHeaderUserAction {...props.user} />
            <TextPost text={props.quotation.text} />
            <BoxPostImage fileIds={props.quotation.fileIds} />
            <BoxPostDate createdAt={props.quotation.createdAt} />
            <BoxPostActions
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
      </BoxCard>
    )
  }

  if (props.quotation) {
    return (
      <BoxCard onClick={() => onPushRouter()}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
          <Stack spacing={2} w={"full"}>
            <BoxHeaderUserAction {...props.user} />
            <BoxPostReply {...props.quotation.user} />
            <TextPost text={props.text} />
            <BoxPostImage fileIds={props.fileIds} />
            <BoxCardQuotationEmbedded {...props.quotation} />
            <BoxPostDate createdAt={props.createdAt} />
            <BoxPostActions
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
      </BoxCard>
    )
  }

  if (props.reply) {
    return (
      <BoxCard onClick={() => router.push(`/posts/${props.reply?.id}`)}>
        <HStack align={"start"} spacing={4}>
          <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
          <Stack spacing={2} w={"full"}>
            <BoxHeaderUserAction {...props.user} />
            <BoxPostReply {...props.reply.user} />
            <TextPost text={props.text} />
            <BoxPostImage fileIds={props.fileIds} />
            <BoxPostDate createdAt={props.createdAt} />
            <BoxPostActions
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
      </BoxCard>
    )
  }

  return (
    <BoxCard onClick={() => onPushRouter()}>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
        <Stack spacing={2} w={"full"}>
          <BoxHeaderUserAction {...props.user} />
          <TextPost text={props.text} />
          <BoxPostImage fileIds={props.fileIds} />
          <BoxPostDate createdAt={props.createdAt} />
          <BoxPostActions
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
    </BoxCard>
  )
}
