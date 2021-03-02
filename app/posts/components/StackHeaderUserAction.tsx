import { HStack, Stack, useDisclosure } from "@chakra-ui/react"
import { AlertDialogDelete } from "app/posts/components/AlertDialogDelete"
import { MenuPost } from "app/posts/components/MenuPost"
import { StackPostUser } from "app/posts/components/StackPostUser"
import { useSession } from "blitz"
import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import React, { FunctionComponent } from "react"

export const StackHeaderUserAction: FunctionComponent<QueryEmbeddedUser> = ({
  id,
  name,
  username,
}) => {
  const session = useSession()

  const deleteDialogDisclosure = useDisclosure()

  return (
    <HStack justify={"space-between"} spacing={4} align={"center"}>
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
