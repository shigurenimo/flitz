import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { StackPostImage } from "app/posts/components/StackPostImage"
import { StackPostMenu } from "app/posts/components/StackPostMenu"
import getPost from "app/posts/queries/getPost"
import { useParam, useQuery, useSession } from "blitz"
import React, { FunctionComponent } from "react"

export const ShowPostPageDetail: FunctionComponent = () => {
  const postId = useParam("postId", "string")

  const [post] = useQuery(getPost, { id: postId + "" })

  const session = useSession()

  return (
    <Stack spacing={4} px={4}>
      <HStack spacing={4}>
        <AvatarUser userId={post.userId} />
        <HStack>
          <Stack spacing={0}>
            <Text fontWeight={"bold"}>{post.user.name}</Text>
            <Text color={"gray.500"}>{`@${post.user.username}`}</Text>
          </Stack>
          <StackPostMenu isOwnPost={session.userId === post.user.id} />
        </HStack>
      </HStack>
      <Stack>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          {post.text}
        </Text>
      </Stack>
      {post.files?.length && <StackPostImage files={post.files} />}
      <HStack>
        <Text color={"gray.500"} fontSize={"lg"}>
          {post.createdAt.toLocaleTimeString()}
        </Text>
        <Text color={"gray.500"} fontSize={"lg"}>
          {post.createdAt.toDateString()}
        </Text>
      </HStack>
    </Stack>
  )
}
