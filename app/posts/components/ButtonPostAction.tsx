import { Button, ButtonProps, useColorModeValue } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = ButtonProps & {
  onClick?: () => void
}

export const ButtonPostAction: FunctionComponent<Props> = ({
  onClick,
  isActive = false,
  ...props
}) => {
  const bg = useColorModeValue("gray.50", "gray.700")

  return (
    <Button
      bg={bg}
      colorScheme={isActive ? "primary" : "gray"}
      isActive={isActive}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      px={2}
      size={"sm"}
      variant={"ghost"}
      {...props}
    />
  )
}
