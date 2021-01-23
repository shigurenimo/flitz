import { Box, HStack } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { RenderFileLoader } from "app/components/RenderFileLoader"
import { BoxProfileHeader } from "app/users/components/BoxProfileHeader"
import React, { FunctionComponent } from "react"

type Props = {
  headerImage: { id: string } | null
  headerImageFile: File | null
  iconImage: { id: string } | null
  iconImageFile: File | null
  id: string
}

export const StackProfileUpdateActions: FunctionComponent<Props> = ({
  headerImage,
  headerImageFile,
  iconImage,
  iconImageFile,
  id,
}) => {
  return (
    <Box>
      <HStack w={"full"}>
        {headerImageFile && (
          <RenderFileLoader
            key={`${headerImageFile.name}-${headerImageFile.lastModified}`}
            file={headerImageFile}
            render={(src) => <BoxProfileHeader src={src} />}
          />
        )}
        {!headerImageFile && (
          <BoxProfileHeader
            fileId={headerImage?.id}
            src={"https://via.placeholder.com/400?text=FLITZ"}
          />
        )}
      </HStack>
      <HStack spacing={4} align={"center"} mt={-12} px={4}>
        {iconImageFile && (
          <RenderFileLoader
            key={`${iconImageFile.name}-${iconImageFile.lastModified}`}
            file={iconImageFile}
            render={(url) => <AvatarUser userId={id} src={url} size={"xl"} />}
          />
        )}
        {!iconImageFile && (
          <AvatarUser userId={id} fileId={iconImage?.id} size={"xl"} />
        )}
      </HStack>
    </Box>
  )
}
