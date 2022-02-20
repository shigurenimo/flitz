import { HStack, Stack, useDisclosure } from "@chakra-ui/react"
import { AlertDialogDelete } from "app/posts/components/AlertDialogDelete"
import { BoxPostUser } from "app/posts/components/BoxPostUser"
import { MenuPost } from "app/posts/components/MenuPost"
import { useSession } from "blitz"
import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import React, { VFC } from "react"

type Props = AppEmbeddedUser

export const BoxHeaderUserAction: VFC<Props> = (props) => {
  const session = useSession()

  const deleteDialogDisclosure = useDisclosure()

  const onDelete = () => {
    deleteDialogDisclosure.onClose()
  }

  const onOpenDialog = () => {
    deleteDialogDisclosure.onOpen()
  }

  return (
    <HStack justify={"space-between"} spacing={4} align={"center"}>
      <BoxPostUser id={props.id} name={props.name} username={props.username} />
      <Stack>
        <MenuPost
          isOwnPost={session.userId === props.id}
          onOpenDialog={onOpenDialog}
        />
        <AlertDialogDelete
          disclosure={deleteDialogDisclosure}
          onDelete={onDelete}
        />
      </Stack>
    </HStack>
  )
}
