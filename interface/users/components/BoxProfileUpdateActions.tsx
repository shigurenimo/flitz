import { Box, HStack } from "@chakra-ui/react"
import { FC } from "react"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { useFileURL } from "interface/core/hooks/useFileURL"
import { BoxProfileHeader } from "interface/users/components/BoxProfileHeader"

type Props = {
  headerFile: File | null
  iconFile: File | null
  iconImageId: string | null
  headerImageId: string | null
  userId: string | null
}

export const BoxProfileUpdateActions: FC<Props> = (props) => {
  const [headerFileURL] = useFileURL(props.headerFile)

  const [iconFileURL] = useFileURL(props.iconFile)

  return (
    <Box>
      <HStack w={"full"}>
        {props.headerFile !== null && headerFileURL !== null && (
          <BoxProfileHeader
            key={`${props.headerFile.name}-${props.headerFile.lastModified}`}
            src={headerFileURL}
          />
        )}
        {headerFileURL === null && (
          <BoxProfileHeader fileId={props.headerImageId} />
        )}
      </HStack>
      <HStack spacing={4} align={"center"} mt={-10} px={4}>
        {props.iconFile !== null && iconFileURL !== null && (
          <AvatarUser
            key={`${props.iconFile.name}-${props.iconFile.lastModified}`}
            userId={props.userId}
            src={iconFileURL}
            size={"xl"}
          />
        )}
        {props.iconFile === null && (
          <AvatarUser
            userId={props.userId}
            fileId={props.iconImageId}
            size={"xl"}
          />
        )}
      </HStack>
    </Box>
  )
}
