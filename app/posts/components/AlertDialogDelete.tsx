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
import React, { FunctionComponent, useRef } from "react"

export const AlertDialogDelete: FunctionComponent<{
  disclosure: UseDisclosureReturn
  onDelete(): void
}> = (props) => {
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
