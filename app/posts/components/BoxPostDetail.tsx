import { HStack, Stack, Text } from "@chakra-ui/react"
import { useParam, useQuery } from "blitz"
import { FC } from "react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxHeaderUserAction } from "app/posts/components/BoxHeaderUserAction"
import { BoxPostImage } from "app/posts/components/BoxPostImage"
import getPost from "app/posts/queries/getPost"

export const BoxPostDetail: FC = () => {
  const postId = useParam("postId", "string")

  const [post] = useQuery(getPost, { id: postId + "" })

  return (
    <Stack spacing={4} px={4}>
      <HStack spacing={4}>
        <AvatarUser userId={post.user.id} />
        <BoxHeaderUserAction {...post.user} />
      </HStack>
      <Stack>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          {post.text}
        </Text>
      </Stack>
      {post.fileIds?.length && <BoxPostImage fileIds={post.fileIds} />}
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
