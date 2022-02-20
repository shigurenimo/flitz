import { HStack, Stack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxCard } from "app/core/components/BoxCard"
import { BoxHeaderUserAction } from "app/posts/components/BoxHeaderUserAction"
import { BoxPostActions } from "app/posts/components/BoxPostActions"
import { BoxPostDate } from "app/posts/components/BoxPostDate"
import { BoxPostImage } from "app/posts/components/BoxPostImage"
import { TextPost } from "app/posts/components/TextPost"
import { AppQuotation } from "integrations/interface/types/appQuotation"
import React, { VFC } from "react"

type Props = AppQuotation

export const BoxCardPostReply: VFC<Props> = (props) => {
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
