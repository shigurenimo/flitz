import { HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { useRouter } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  createdAt: Date
  id: string
  text: string | null
  userId: string
  user: {
    name: string | null
    username: string | null
  }
}

export const StackCardQuotationEmbedded: FunctionComponent<Props> = ({
  createdAt,
  id,
  text,
  user,
  userId,
}) => {
  const hoverBg = useColorModeValue("gray.200", "gray.600")

  const bg = useColorModeValue("gray.50", "gray.700")

  const router = useRouter()

  const onClickQuotation = () => {
    router.push(`/posts/${id}`)
  }

  return (
    <Stack
      _hover={{ bg: hoverBg }}
      bg={bg}
      borderWidth={"1px"}
      p={4}
      rounded={"md"}
      spacing={2}
      transition={"all 250ms"}
      onClick={(event) => {
        event.stopPropagation()
        onClickQuotation()
      }}
    >
      <HStack align={"center"} spacing={2}>
        <AvatarUser userId={userId} size={"sm"} />
        {user.name && <Text fontWeight={"bold"}>{user.name}</Text>}
        {user.name ? (
          <Text color={"gray.500"} fontSize={"sm"}>
            {`@${user.username || userId}`}
          </Text>
        ) : (
          <Text fontWeight={"bold"}>{`@${user.username || userId}`}</Text>
        )}
      </HStack>
      {text && (
        <Text fontSize={"lg"} fontWeight={"bold"}>
          {text}
        </Text>
      )}
      <HStack align={"center"} spacing={2}>
        <Text color={"gray.500"} fontSize={"sm"}>
          {createdAt.toLocaleTimeString()}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"}>
          {createdAt.toDateString()}
        </Text>
      </HStack>
    </Stack>
  )
}
