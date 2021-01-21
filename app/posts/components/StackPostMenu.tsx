import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  Button,
  useDisclosure,
  UseDisclosureReturn,
  useClipboard,
  useToast,
} from "@chakra-ui/react"
import React, { useRef, FunctionComponent, useEffect } from "react"
import {
  FiClipboard,
  FiMoreHorizontal,
  FiShare,
  FiTrash2,
} from "react-icons/fi"

export const StackPostMenu: FunctionComponent = () => {
  const deleteDialogDisclosure = useDisclosure()

  const hasShareAPI = typeof navigator.share !== "undefined"

  const onShare = () => {
    if (hasShareAPI) {
      navigator.share({
        title: "Flitz",
        url: window.location.href,
      })
    }
  }

  const onCopy = useCopy(
    typeof window !== "undefined" ? window.location.href : ""
  )

  return (
    <Stack>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreHorizontal />}
          isRound
          size={"sm"}
          colorScheme={"gray"}
          variant={"ghost"}
          onClick={(event) => event.stopPropagation()}
        >
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem
            aria-label={"Delete"}
            icon={<FiTrash2 />}
            onClick={deleteDialogDisclosure.onOpen}
          >
            Delete
          </MenuItem>
          {hasShareAPI && (
            <MenuItem aria-label={"Share"} icon={<FiShare />} onClick={onShare}>
              Share
            </MenuItem>
          )}
          <MenuItem
            aria-label={"Copy link to Post"}
            icon={<FiClipboard />}
            onClick={onCopy}
          >
            Copy link to Post
          </MenuItem>
        </MenuList>
      </Menu>
      <DeleteDialog
        disclosure={deleteDialogDisclosure}
        onDelete={() => {
          deleteDialogDisclosure.onClose()
        }}
      />
    </Stack>
  )
}

const DeleteDialog: FunctionComponent<{
  disclosure: UseDisclosureReturn
  onDelete(): void
}> = (props) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={props.disclosure.onClose}
      isOpen={props.disclosure.isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Delete Post?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={props.disclosure.onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" ml={3} onClick={props.onDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const useCopy = (text: string) => {
  const toast = useToast()

  const { hasCopied, onCopy } = useClipboard(text)

  useEffect(() => {
    if (hasCopied) toast({ description: "Copied to clipboard" })
  }, [hasCopied, toast])

  return onCopy
}
