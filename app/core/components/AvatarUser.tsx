import { Avatar, AvatarProps } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = AvatarProps & {
  fileId?: string | null
  src?: string
  userId: string | null
}

export const AvatarUser: FunctionComponent<Props> = ({
  fileId,
  src,
  userId,
  ...props
}) => {
  return (
    <Avatar
      bg={"white"}
      borderColor={"gray.100"}
      borderWidth={"1px"}
      p={1}
      src={
        src ? src : fileId ? `/api/images/${fileId}` : `/api/icons/${userId}`
      }
      {...props}
    />
  )
}
