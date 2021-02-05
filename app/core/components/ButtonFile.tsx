import { Button, ButtonProps, Icon, useToast } from "@chakra-ui/react"
import React, { FunctionComponent, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FiImage } from "react-icons/fi"

type Props = Omit<ButtonProps, "onChange"> & {
  onChange(file: File): void
}

export const ButtonFile: FunctionComponent<Props> = ({
  children,
  onChange,
  ...props
}) => {
  const { t } = useTranslation()

  const ref = useRef<HTMLInputElement>(null)

  const toast = useToast()

  return (
    <Button
      aria-label={"Image"}
      leftIcon={<Icon as={FiImage} fontSize={"xl"} />}
      onClick={() => ref?.current?.click?.()}
      variant={"outline"}
      {...props}
    >
      {children}
      <input
        type={"file"}
        multiple={false}
        ref={ref}
        onChange={(event) => {
          const [file] = Array.from(event.target.files || [])
          if (!file) return
          if (!file.type.includes("image")) {
            toast({
              status: "error",
              title: t`Only image files are allowed.`,
            })
            return
          }
          const fileSize = file.size / 1024 / 1024 // in MiB
          if (fileSize > 2) {
            toast({ status: "error", title: t`File size exceeds 2 MiB.` })
            return
          }
          onChange(file)
        }}
        style={{ display: "none" }}
      />
    </Button>
  )
}
