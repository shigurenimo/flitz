import { Box, Button, Stack, useToast } from "@chakra-ui/react"
import logout from "app/home/mutations/logout"
import { useMutation, useRouter } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

export const SettingsPageLogout: FunctionComponent = () => {
  const router = useRouter()

  const { t } = useTranslation()

  const toast = useToast()

  const [logoutMutation, { isLoading }] = useMutation(logout)

  const onLogout = async () => {
    await logoutMutation()
    router.push("/")
    toast({ description: t`Logout Success`, status: "success" })
  }

  return (
    <Stack px={4}>
      <Box>
        <Button
          isLoading={isLoading}
          loadingText={t`Logout`}
          onClick={onLogout}
        >
          {t`Logout`}
        </Button>
      </Box>
    </Stack>
  )
}
