import { AspectRatio, Box, Image } from "@chakra-ui/react"
import React, { FunctionComponent } from "react"

type Props = {
  fileId?: string | null
  src?: string
}

export const BoxProfileHeader: FunctionComponent<Props> = ({ fileId, src }) => {
  return (
    <Box
      w={"full"}
      bg={"white"}
      rounded={{ base: 0, md: "md" }}
      overflow={"hidden"}
    >
      <AspectRatio w={"full"} ratio={1 / 0.4}>
        <Image
          src={fileId ? `/api/images/${fileId}` : src}
          style={{ filter: "brightness(0.5)" }}
          fallbackSrc={"https://via.placeholder.com/400?text=FLITZ"}
        />
      </AspectRatio>
    </Box>
  )
}
