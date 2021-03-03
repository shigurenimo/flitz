import { StackCardNotificationFriendship } from "app/notifications/components/StackCardNotificationFriendship"
import { StackCardNotificationLike } from "app/notifications/components/StackCardNotificationLike"
import { StackCardPost } from "app/posts/components/StackCardPost"
import { Link } from "blitz"
import { QueryNotification } from "integrations/interface/types/queryNotification"
import React, { FunctionComponent } from "react"

export const StackCardNotification: FunctionComponent<QueryNotification> = (
  props
) => {
  if (props.type === "FOLLOW") {
    return (
      <Link href={`/${props.embedded.username}`} passHref>
        <StackCardNotificationFriendship {...props} />
      </Link>
    )
  }

  if (props.type === "LIKE") {
    return (
      <Link href={`/posts/${props.embedded.id}`} passHref>
        <StackCardNotificationLike {...props} />
      </Link>
    )
  }

  if (props.type === "POST") {
    return <StackCardPost isDisabled={false} {...props.embedded} />
  }

  /*
  if (post) {
    return (
      <Link href={`/posts/${post.reply?.id}`}>
        <a>
          <StackCardNotificationReply createdAt={createdAt} post={post} />
        </a>
      </Link>
    )
  }
  */

  return null
}
