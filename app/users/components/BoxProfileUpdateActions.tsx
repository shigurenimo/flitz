import { Box, HStack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { RenderFileLoader } from "app/core/components/RenderFileLoader"
import { BoxProfileHeader } from "app/users/components/BoxProfileHeader"
import { AppProfile } from "integrations/interface/types/appProfile"
import React, { VFC } from "react"

type Props = AppProfile & {
  headerImageFile: File | null
  iconImageFile: File | null
}

export const BoxProfileUpdateActions: VFC<Props> = (props) => {
  return (
    <Box>
      <HStack w={"full"}>
        {props.headerImageFile && (
          <RenderFileLoader
            key={`${props.headerImageFile.name}-${props.headerImageFile.lastModified}`}
            file={props.headerImageFile}
            render={(src) => <BoxProfileHeader src={src} />}
          />
        )}
        {props.headerImageFile === null && (
          <BoxProfileHeader
            fileId={props.headerImageId}
            src={"https://via.placeholder.com/400?text=FLITZ"}
          />
        )}
      </HStack>
      <HStack spacing={4} align={"center"} mt={-10} px={4}>
        {props.iconImageFile && (
          <RenderFileLoader
            key={`${props.iconImageFile.name}-${props.iconImageFile.lastModified}`}
            file={props.iconImageFile}
            render={(url) => (
              <AvatarUser userId={props.id} src={url} size={"xl"} />
            )}
          />
        )}
        {props.iconImageFile === null && (
          <AvatarUser
            userId={props.id}
            fileId={props.iconImageId}
            size={"xl"}
          />
        )}
      </HStack>
    </Box>
  )
}
