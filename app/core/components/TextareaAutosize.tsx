import { Textarea, TextareaProps } from "@chakra-ui/react"
import React, { forwardRef } from "react"
import ResizeTextarea, { TextareaAutosizeProps } from "react-textarea-autosize"

// https://chakra-ui.com/docs/features/chakra-factory#chakra-factory-function
export const TextareaAutosize = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & TextareaAutosizeProps
>((props, ref) => {
  return (
    <Textarea
      as={ResizeTextarea}
      maxRows={8}
      minH={"unset"}
      minRows={1}
      overflow={"hidden"}
      placeholder={"あいうえお"}
      ref={ref}
      resize={"none"}
      style={{ transition: "none" }}
      {...props}
    />
  )
})
