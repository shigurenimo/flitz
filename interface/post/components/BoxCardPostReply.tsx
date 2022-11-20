import { HStack, Stack } from "@chakra-ui/react"
import { FC } from "react"
import { AppQuotation } from "infrastructure/models/appQuotation"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"
import { BoxHeaderUserAction } from "interface/post/components/BoxHeaderUserAction"
import { BoxPostActions } from "interface/post/components/BoxPostActions"
import { BoxPostDate } from "interface/post/components/BoxPostDate"
import { BoxPostImage } from "interface/post/components/BoxPostImage"
import { TextPost } from "interface/post/components/TextPost"

type Props = AppQuotation

export const BoxCardPostReply: FC<Props> = (props) => {
  return (
    <BoxCard>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
        <Stack spacing={2} w={"full"}>
          <BoxHeaderUserAction {...props.user} />
          <TextPost text={props.text} />
          <BoxPostImage fileIds={props.fileIds} />
          <BoxPostDate createdAt={props.createdAt} />
          <BoxPostActions
            hasLike={props.hasLike}
            hasQuotation={false}
            hasReply={props.hasReply}
            isDisabled={false}
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
