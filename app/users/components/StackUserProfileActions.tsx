import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { Link, useSession } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

type Props = {
  id: string
  name: string | null
  username: string
}

export const StackUserProfileActions: FunctionComponent<Props> = ({
  id,
  name,
  username,
}) => {
  const { t } = useTranslation()

  const session = useSession()

  return (
    <HStack spacing={4} align={"flex-start"} justify={"space-between"}>
      <HStack spacing={4} align={"center"}>
        <AvatarUser userId={id} size={"xl"} />
        <Stack flex={1} h={"full"}>
          <Heading size={"lg"}>{name}</Heading>
          <Stack spacing={0}>
            <Text fontSize={"md"}>{`@${username}`}</Text>
          </Stack>
        </Stack>
      </HStack>
      {session.userId === id && (
        <Stack align={"flex-start"}>
          <Link href={`/${username}/update`}>
            <Button>{t("Update")}</Button>
          </Link>
        </Stack>
      )}
    </HStack>
  )
}
