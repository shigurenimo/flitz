import { Box, Button, Stack } from "@chakra-ui/react"
import logout from "app/home/mutations/logout"
import { useMutation, useRouter } from "blitz"
import React, { FunctionComponent } from "react"

export const SettingsPageLogout: FunctionComponent = () => {
  const router = useRouter()

  const [logoutMutation, { isLoading }] = useMutation(logout)

  const onLogout = async () => {
    await logoutMutation()
    router.push("/")
  }

  return (
    <Stack>
      <Box>
        <Button isLoading={isLoading} loadingText={"Logout"} onClick={onLogout}>
          {"Logout"}
        </Button>
      </Box>
    </Stack>
  )
}
