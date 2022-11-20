import { AspectRatio, Box, Image } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  fileId?: string | null
  src?: string
}

export const BoxProfileHeader: FC<Props> = (props) => {
  return (
    <Box
      w={"full"}
      bg={"white"}
      rounded={{ base: 0, md: "md" }}
      overflow={"hidden"}
    >
      <AspectRatio w={"full"} ratio={1 / 0.4}>
        <Image
          alt={props.fileId ?? ""}
          src={props.fileId ? `/api/images/${props.fileId}` : props.src}
          style={{ filter: "brightness(0.5)" }}
          fallbackSrc={"https://via.placeholder.com/400?text=FLITZ"}
        />
      </AspectRatio>
    </Box>
  )
}
