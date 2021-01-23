import { StackCardNotificationFriendship } from "app/notifications/components/StackCardNotificationFriendship"
import { StackCardNotificationLike } from "app/notifications/components/StackCardNotificationLike"
import { StackCardPost } from "app/posts/components/StackCardPost"
import { Link } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  createdAt: Date
  friendship: {
    follower: {
      biography: string
      id: string
      name: string | null
      username: string
    }
  } | null
  like: {
    post: {
      createdAt: Date
      id: string
      text: string | null
      userId: string
      user: {
        name: string | null
        username: string
      }
    }
    user: {
      biography: string
      id: string
      name: string | null
      username: string
    }
  } | null
  post: {
    createdAt: Date
    id: string
    isDisabled?: boolean
    likesCount: number
    likes?: {
      userId: string
    }[]
    quotationsCount: number
    replies?: {
      userId: string
    }[]
    reply?: {
      createdAt: Date
      id: string
      likesCount: number
      likes?: {
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
  } | null
}

export const StackCardNotification: FunctionComponent<Props> = ({
  createdAt,
  friendship,
  like,
  post,
}) => {
  if (friendship) {
    return (
      <Link href={`/${friendship.follower.username}`} passHref>
        <StackCardNotificationFriendship
          createdAt={createdAt}
          friendship={friendship}
        />
      </Link>
    )
  }

  if (like) {
    return (
      <Link href={`/posts/${like.post.id}`} passHref>
        <StackCardNotificationLike createdAt={createdAt} like={like} />
      </Link>
    )
  }

  if (post) {
    return <StackCardPost isDisabled={false} {...post} />
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
