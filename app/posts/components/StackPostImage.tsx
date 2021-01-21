import { AspectRatio, HStack, Image } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  files: { id: string }[]
}

export const StackPostImage: FunctionComponent<Props> = ({ files }) => {
  const [file] = files

  return (
    <HStack w={"full"} borderWidth={1} borderRadius={"md"} overflow={"hidden"}>
      <AspectRatio w={"full"} ratio={1 / 0.5625}>
        <Image src={`/api/images/${file.id}`} />
      </AspectRatio>
    </HStack>
  )
}
