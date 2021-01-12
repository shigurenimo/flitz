import { HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import getPost from "app/posts/queries/getPost"
import { useParam, useQuery } from "blitz"
import React, { FunctionComponent } from "react"

export const ShowPostPageDetail: FunctionComponent = () => {
  const postId = useParam("postId", "string")

  const [post] = useQuery(getPost, { where: { id: postId } })

  return (
    <Stack spacing={4} px={4}>
      <HStack spacing={4}>
        <AvatarUser userId={post.userId} />
        <Stack spacing={0}>
          <Text fontWeight={"bold"}>{post.user.name}</Text>
          <Text color={"gray.500"}>{`@${post.user.username}`}</Text>
        </Stack>
      </HStack>
      <Stack>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          {post.text}
        </Text>
      </Stack>
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
