import { Avatar, AvatarProps } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = AvatarProps & { userId: string }

export const AvatarUser: FunctionComponent<Props> = ({ userId, ...props }) => {
  return (
    <Avatar
      bg={"white"}
      borderColor={"gray.100"}
      borderWidth={"1px"}
      p={1}
      src={`/api/icons/${userId}`}
      {...props}
    />
  )
}
