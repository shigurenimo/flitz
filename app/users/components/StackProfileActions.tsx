import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxProfileHeader } from "app/users/components/BoxProfileHeader"
import { Link, useSession } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = {
  headerImage: { id: string } | null
  iconImage: { id: string } | null
  id: string
  name: string | null
  username: string
}

export const StackProfileActions: FunctionComponent<Props> = ({
  headerImage,
  iconImage,
  id,
  name,
  username,
}) => {
  const { t } = useTranslation()

  const session = useSession()

  return (
    <Stack spacing={4}>
      <Box>
        <HStack w={"full"}>
          <BoxProfileHeader
            fileId={headerImage?.id}
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
            <AvatarUser userId={id} fileId={iconImage?.id} size={"xl"} />
          </HStack>
          {session.userId === id && (
            <Stack align={"flex-start"}>
              <Link href={`/${username}/update`}>
                <Button>{t("Update")}</Button>
              </Link>
            </Stack>
          )}
        </HStack>
      </Box>
      <Stack flex={1} h={"full"} px={4}>
        <Heading size={"lg"}>{name}</Heading>
        <Stack spacing={0}>
          <Text fontSize={"md"}>{`@${username}`}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}
