import { AspectRatio, HStack, Image } from "@chakra-ui/react"
import React, { VFC } from "react"

type Props = { fileIds: string[] }

export const BoxPostImage: VFC<Props> = (props) => {
  if (props.fileIds.length === 0) {
    return null
  }

  const [fileId] = props.fileIds

  return (
    <HStack w={"full"} borderWidth={1} borderRadius={"md"} overflow={"hidden"}>
      <AspectRatio w={"full"} ratio={1 / 0.5625}>
        <Image
          alt={fileId}
          src={`/api/images/${fileId}`}
          fallbackSrc={"https://via.placeholder.com/400?text=FLITZ"}
        />
      </AspectRatio>
    </HStack>
  )
}
