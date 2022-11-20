import { useParam } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Button, HStack, Stack, useColorModeValue } from "@chakra-ui/react"
import { FC, useState } from "react"
import createMessage from "app/mutations/createMessage"
import { TextareaAutosize } from "interface/core/components/TextareaAutosize"

type Props = { refetch(): void }

export const BoxBoxMessageThreadTextarea: FC<Props> = ({ refetch }) => {
  const recipientId = useParam("recipientId", "string")

  const bg = useColorModeValue("white", "gray.800")

  const [text, setText] = useState("")

  const [createMessageMutation, { isLoading }] = useMutation(createMessage)

  const onCreateIssue = async () => {
    try {
      await createMessageMutation({ text, relatedUserId: recipientId + "" })
      setText("")
      refetch()
    } catch (error) {
      alert(JSON.stringify(error, null, 2))
    }
  }

  return (
    <Stack
      bg={bg}
      bottom={0}
      position={"sticky"}
      px={4}
      py={{ base: 4, lg: 8 }}
      rounded={"md"}
    >
      <HStack spacing={4}>
        <TextareaAutosize
          maxRows={8}
          minH={"unset"}
          minRows={1}
          overflow={"hidden"}
          resize={"none"}
          style={{ transition: "none" }}
          disabled={isLoading}
          onChange={(event) => setText(event.target.value)}
          placeholder={"Message"}
          value={text}
        />
        <Button
          isLoading={isLoading}
          loadingText={"Send"}
          onClick={() => onCreateIssue()}
        >
          {"Send"}
        </Button>
      </HStack>
    </Stack>
  )
}
