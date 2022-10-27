import { HStack, Stack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { AppPost } from "integrations/types/appPost"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"
import { BoxCardQuotationEmbedded } from "interface/posts/components/BoxCardQuotationEmbedded"
import { BoxHeaderRepost } from "interface/posts/components/BoxHeaderRepost"
import { BoxHeaderUserAction } from "interface/posts/components/BoxHeaderUserAction"
import { BoxPostActions } from "interface/posts/components/BoxPostActions"
import { BoxPostDate } from "interface/posts/components/BoxPostDate"
import { BoxPostImage } from "interface/posts/components/BoxPostImage"
import { BoxPostReply } from "interface/posts/components/BoxPostReply"
import { TextPost } from "interface/posts/components/TextPost"

type Props = AppPost & { isDisabled: boolean }

export const BoxCardPost: FC<Props> = (props) => {
  const router = useRouter()

  const onCheckPost = () => {
    router.push(`/posts/${props.id}`)
  }

  const onClickQuotation = () => {
    router.push(`/posts/${props.quotation?.id}`)
  }

  const onCheckReply = () => {
    router.push(`/posts/${props.reply?.id}`)
  }

  /**
   * リポスト（テキストなし）
   */
  if (props.quotation && props.text === null) {
    return (
      <BoxCard onClick={onClickQuotation}>
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

  /**
   * リポスト（テキストあり）
   */
  if (props.quotation) {
    return (
      <BoxCard onClick={onCheckPost}>
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

  /**
   * リプライ
   */
  if (props.reply) {
    return (
      <BoxCard onClick={onCheckReply}>
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

  /**
   * ポスト
   */
  return (
    <BoxCard onClick={onCheckPost}>
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
