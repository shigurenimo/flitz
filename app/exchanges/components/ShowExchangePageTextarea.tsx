import { Button, HStack, Stack, useColorModeValue } from "@chakra-ui/react"
import { TextareaAutosize } from "app/core/components/TextareaAutosize"
import createMessage from "app/exchanges/mutations/createMessage"
import { useMutation, useParam } from "blitz"
import React, { FunctionComponent, useState } from "react"

type Props = { refetch: () => void }

export const ShowExchangePageTextarea: FunctionComponent<Props> = ({
  refetch,
}) => {
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
          isDisabled={isLoading}
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
