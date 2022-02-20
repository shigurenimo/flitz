import { BoxCardNotificationFriendship } from "app/notifications/components/BoxCardNotificationFriendship"
import { BoxCardNotificationLike } from "app/notifications/components/BoxCardNotificationLike"
import { BoxCardPost } from "app/posts/components/BoxCardPost"
import { Link } from "blitz"
import { AppNotification } from "integrations/interface/types/appNotification"
import React, { VFC } from "react"

type Props = AppNotification

export const BoxCardNotification: VFC<Props> = (props) => {
  if (props.type === "FOLLOW") {
    return (
      <Link href={`/${props.embedded.username}`} passHref>
        <BoxCardNotificationFriendship {...props} />
      </Link>
    )
  }

  if (props.type === "LIKE") {
    return (
      <Link href={`/posts/${props.embedded.id}`} passHref>
        <BoxCardNotificationLike {...props} />
      </Link>
    )
  }

  if (props.type === "POST") {
    return <BoxCardPost isDisabled={false} {...props.embedded} />
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
