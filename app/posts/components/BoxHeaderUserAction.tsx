import { HStack, Stack, useDisclosure } from "@chakra-ui/react"
import { useSession } from "blitz"
import { FC } from "react"
import { AlertDialogDelete } from "app/posts/components/AlertDialogDelete"
import { BoxPostUser } from "app/posts/components/BoxPostUser"
import { MenuPost } from "app/posts/components/MenuPost"
import { AppUserEmbedded } from "integrations/types/appUserEmbedded"

type Props = AppUserEmbedded

export const BoxHeaderUserAction: FC<Props> = (props) => {
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
