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
import updateAccountEmail from "app/settings/mutations/updateAccountEmail"
import getAccount from "app/settings/queries/getAccount"
import updateUsername from "app/users/mutations/updateUsername"
import { useMutation, useQuery, useSession } from "blitz"
import React, { FunctionComponent } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

export const SettingsPageAccount: FunctionComponent = () => {
  const { t } = useTranslation()

  const toast = useToast()

  const session = useSession()

  const [account] = useQuery(getAccount, null, {
    refetchInterval: false,
  })

  const [
    updateUsernameMutation,
    { isLoading: updateUsernameLoading },
  ] = useMutation(updateUsername)

  const [
    updateAccountEmailMutation,
    { isLoading: updateAccountEmailLoading },
  ] = useMutation(updateAccountEmail)

  const onUpdateUsername = async () => {
    const values = getValues()
    try {
      await updateUsernameMutation({ username: values.username })
      toast({ description: t`Changes have bee saved`, status: "success" })
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  const onUpdateAccountEmail = async () => {
    const values = getValues()
    try {
      await updateAccountEmailMutation({ email: values.email })
      toast({ description: t`Changes have bee saved`, status: "success" })
    } catch (err) {
      toast({ status: "error", title: err.message })
    }
  }

  const { handleSubmit, errors, register, getValues } = useForm({
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
            name={"username"}
            placeholder={session.username}
            ref={register({})}
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
          {errors.username && errors.username.message}
        </FormErrorMessage>
        <FormHelperText>{t`※Username can't be duplicated.`}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>{t`Email`}</FormLabel>
        <HStack spacing={4}>
          <Input
            aria-label={t`Email`}
            isDisabled={updateAccountEmailLoading}
            name={"email"}
            placeholder={account.email}
            ref={register({})}
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
          {errors.username && errors.username.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  )
}
