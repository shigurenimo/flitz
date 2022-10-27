import { useMutation } from "@blitzjs/rpc"
import { Box, Button, Stack, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import logout from "integrations/mutations/logout"

export const SettingsPageLogout: FC = () => {
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
