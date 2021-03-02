import { HStack, Stack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackHeaderUserAction } from "app/posts/components/StackHeaderUserAction"
import { StackPostActions } from "app/posts/components/StackPostActions"
import { StackPostDate } from "app/posts/components/StackPostDate"
import { StackPostImage } from "app/posts/components/StackPostImage"
import { StackPostText } from "app/posts/components/StackPostText"
import { QueryQuotation } from "integrations/interface/types/queryQuotation"
import React, { FunctionComponent } from "react"

export const StackCardReply: FunctionComponent<QueryQuotation> = (props) => {
  return (
    <StackCard>
      <HStack align={"start"} spacing={4}>
        <AvatarUser userId={props.user.id} fileId={props.user.iconImageId} />
        <Stack spacing={2} w={"full"}>
          <StackHeaderUserAction {...props.user} />
          <StackPostText text={props.text} />
          <StackPostImage fileIds={props.fileIds} />
          <StackPostDate createdAt={props.createdAt} />
          <StackPostActions
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
    </StackCard>
  )
}
