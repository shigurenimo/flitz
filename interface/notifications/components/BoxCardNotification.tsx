import Link from "next/link"
import { FC } from "react"
import { BoxCardNotificationFriendship } from "interface/notifications/components/BoxCardNotificationFriendship"
import { BoxCardNotificationLike } from "interface/notifications/components/BoxCardNotificationLike"
import { BoxCardPost } from "interface/posts/components/BoxCardPost"
import { AppNotification } from "integrations/types/appNotification"

type Props = AppNotification

export const BoxCardNotification: FC<Props> = (props) => {
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
