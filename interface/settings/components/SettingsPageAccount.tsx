import { useSession } from "@blitzjs/auth"
import { useMutation, useQuery } from "@blitzjs/rpc"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import updateAccountEmail from "integrations/mutations/updateAccountEmail"
import updateUsername from "integrations/mutations/updateUsername"
import getAccount from "integrations/queries/getAccount"

export const SettingsPageAccount: FC = () => {
  const { t } = useTranslation()

  const toast = useToast()

  const session = useSession()

  const [account] = useQuery(getAccount, null, {
    refetchInterval: false,
  })

  const [updateUsernameMutation, { isLoading: updateUsernameLoading }] =
    useMutation(updateUsername)

  const [updateAccountEmailMutation, { isLoading: updateAccountEmailLoading }] =
    useMutation(updateAccountEmail)

  const onUpdateUsername = async () => {
    const values = getValues()
    try {
      await updateUsernameMutation({ username: values.username })
      toast({ description: t`Changes have bee saved`, status: "success" })
    } catch (error: any) {
      toast({ status: "error", title: error?.message })
    }
  }

  const onUpdateAccountEmail = async () => {
    const values = getValues()
    try {
      await updateAccountEmailMutation({ email: values.email })
      toast({ description: t`Changes have bee saved`, status: "success" })
    } catch (error: any) {
      toast({ status: "error", title: error?.message })
    }
  }

  const { handleSubmit, register, getValues, formState } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      username: "",
      email: account.email,
    },
  })

  const isDisabled = updateUsernameLoading || updateAccountEmailLoading

  return (
    <Stack spacing={8} px={4}>
      <Heading size={"lg"}>{t`Account`}</Heading>
      <FormControl>
        <FormLabel>{t`Username`}</FormLabel>
        <HStack spacing={4}>
          <Input
            aria-label={t`Username`}
            isDisabled={updateUsernameLoading}
            placeholder={session.username}
            {...register("username")}
          />
          <Button
            isDisabled={isDisabled}
            isLoading={updateUsernameLoading}
            loadingText={t`Change`}
            onClick={handleSubmit(onUpdateUsername)}
          >
            {t`Change`}
          </Button>
        </HStack>
        <FormErrorMessage>
          {formState.errors.username?.message}
        </FormErrorMessage>
        <FormHelperText>{t`※Username can't be duplicated.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t`Email`}</FormLabel>
        <HStack spacing={4}>
          <Input
            aria-label={t`Email`}
            isDisabled={updateAccountEmailLoading}
            placeholder={account.email}
            {...register("email")}
          />
          <Button
            isDisabled={isDisabled}
            isLoading={updateAccountEmailLoading}
            loadingText={t`Change`}
            onClick={handleSubmit(onUpdateAccountEmail)}
          >
            {t`Change`}
          </Button>
        </HStack>
        <FormErrorMessage>
          {formState.errors.username?.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}
