import {
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureReturn,
} from "@chakra-ui/react"
import { FC, useRef } from "react"

type Props = {
  disclosure: UseDisclosureReturn
  onDelete(): void
}

export const AlertDialogDelete: FC<Props> = (props) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog
      isCentered
      isOpen={props.disclosure.isOpen}
      leastDestructiveRef={cancelRef}
      motionPreset={"slideInBottom"}
      onClose={props.disclosure.onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{"Delete Post?"}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={props.disclosure.onClose}>
            {"Cancel"}
          </Button>
          <Button colorScheme="red" ml={3} onClick={props.onDelete}>
            {"Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
