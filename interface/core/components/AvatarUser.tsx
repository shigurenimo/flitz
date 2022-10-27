import { Avatar, AvatarProps } from "@chakra-ui/react"
import { FC } from "react"

type Props = AvatarProps & {
  fileId?: string | null
  src?: string
  userId: string | null
}

export const AvatarUser: FC<Props> = ({ fileId, src, userId, ...props }) => {
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
