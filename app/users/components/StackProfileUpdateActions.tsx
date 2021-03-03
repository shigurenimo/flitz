import { Box, HStack } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { RenderFileLoader } from "app/core/components/RenderFileLoader"
import { BoxProfileHeader } from "app/users/components/BoxProfileHeader"
import { QueryProfile } from "integrations/interface/types/queryProfile"
import React, { FunctionComponent } from "react"

export const StackProfileUpdateActions: FunctionComponent<
  QueryProfile & {
    headerImageFile: File | null
    iconImageFile: File | null
  }
> = (props) => {
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
