import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { HStack, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import getPost from "app/queries/getPost"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxHeaderUserAction } from "interface/posts/components/BoxHeaderUserAction"
import { BoxPostImage } from "interface/posts/components/BoxPostImage"

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
