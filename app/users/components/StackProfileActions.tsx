import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxProfileHeader } from "app/users/components/BoxProfileHeader"
import { Link, useSession } from "blitz"
import { QueryProfile } from "integrations/interface/types/queryProfile"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const StackProfileActions: FunctionComponent<QueryProfile> = (props) => {
  const { t } = useTranslation()

  const session = useSession()

  return (
    <Stack spacing={4}>
      <Box>
        <HStack w={"full"}>
          <BoxProfileHeader
            fileId={props.headerImageId}
            src={"https://via.placeholder.com/400?text=FLITZ"}
          />
        </HStack>
        <HStack
          spacing={4}
          align={"flex-end"}
          justify={"space-between"}
          mt={-10}
          px={4}
        >
          <HStack spacing={4} align={"center"}>
            <AvatarUser
              userId={props.id}
              fileId={props.iconImageId}
              size={"xl"}
            />
          </HStack>
          {session.userId === props.id && (
            <Stack align={"flex-start"}>
              <Link href={`/${props.username}/update`}>
                <Button>{t("Update")}</Button>
              </Link>
            </Stack>
          )}
        </HStack>
      </Box>
      <Stack flex={1} h={"full"} px={4}>
        <Heading size={"lg"}>{props.name}</Heading>
        <Stack spacing={0}>
          <Text fontSize={"md"}>{`@${props.username}`}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}
