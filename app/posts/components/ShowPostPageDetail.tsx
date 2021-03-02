import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackHeaderUserAction } from "app/posts/components/StackHeaderUserAction"
import { StackPostImage } from "app/posts/components/StackPostImage"
import getPost from "app/posts/queries/getPost"
import { useParam, useQuery } from "blitz"
import React, { FunctionComponent } from "react"

export const ShowPostPageDetail: FunctionComponent = () => {
  const postId = useParam("postId", "string")

  const [post] = useQuery(getPost, { id: postId + "" })

  return (
    <Stack spacing={4} px={4}>
      <HStack spacing={4}>
        <AvatarUser userId={post.user.id} />
        <StackHeaderUserAction {...post.user} />
      </HStack>
      <Stack>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          {post.text}
        </Text>
      </Stack>
      {post.fileIds?.length && <StackPostImage fileIds={post.fileIds} />}
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
