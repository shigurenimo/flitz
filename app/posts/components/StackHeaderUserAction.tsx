import { HStack, Stack, useDisclosure } from "@chakra-ui/react"
import { AlertDialogDelete } from "app/posts/components/AlertDialogDelete"
import { MenuPost } from "app/posts/components/MenuPost"
import { StackPostUser } from "app/posts/components/StackPostUser"
import { useSession } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const StackHeaderUserAction: FunctionComponent<Props> = ({
  id,
  name,
  username,
}) => {
  const session = useSession()

  const deleteDialogDisclosure = useDisclosure()

  return (
    <HStack justify={"space-between"} spacing={4}>
      <StackPostUser id={id} name={name} username={username} />
      <Stack>
        <MenuPost
          isOwnPost={session.userId === id}
          onOpenDialog={() => {
            deleteDialogDisclosure.onOpen()
          }}
        />
        <AlertDialogDelete
          disclosure={deleteDialogDisclosure}
          onDelete={() => {
            deleteDialogDisclosure.onClose()
          }}
        />
      </Stack>
    </HStack>
  )
}
