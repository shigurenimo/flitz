import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react"
import createUser from "app/auth/mutations/createUser"
import login from "app/auth/mutations/login"
import { AuthenticationError, useMutation, useRouter } from "blitz"
import React, { FunctionComponent } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

export const HomePageLogin: FunctionComponent = () => {
  const { t } = useTranslation()

  const router = useRouter()

  const [loginMutation, { isLoading: isLoadingLogin }] = useMutation(login)

  const [createUserMutation, { isLoading: isLoadingCreateUser }] = useMutation(
    createUser
  )

  const onLogin = async (email: string, password: string) => {
    await loginMutation({ email, password })
    router.push("/")
  }

  const onCreateUser = async (email: string, password: string) => {
    await createUserMutation({ email, password })
    router.push("/")
  }

  const { handleSubmit, errors, register, setError } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  const onSubmitCreateUser = async (values: {
    email: string
    password: string
  }) => {
    try {
      await onCreateUser(values.email, values.password)
    } catch (error) {
      if (error instanceof AuthenticationError) {
        setError("password", { message: "Wrong Password" })
        return
      }

      if (error.message) {
        setError("password", { message: error.message })
        return
      }

      setError("password", { message: "An unknown error has occurred" })
    }
  }

  const onSubmitLogin = async (values: { email: string; password: string }) => {
    try {
      await onLogin(values.email, values.password)
    } catch (error) {
      if (error instanceof AuthenticationError) {
        setError("password", { message: "Wrong Password" })
        return
      }

      if (error.message) {
        setError("password", { message: error.message })
        return
      }

      setError("password", { message: "An unknown error has occurred" })
    }
  }

  const isLoading = isLoadingCreateUser || isLoadingLogin

  return (
    <Stack maxW={{ base: "none", md: 80 }} spacing={8} w={"full"} px={4}>
      <Stack as={"form"} onSubmit={handleSubmit(() => null)} spacing={4}>
        <FormControl isInvalid={errors.email}>
          <Input
            aria-label={"Email"}
            isDisabled={isLoading}
            name={"email"}
            placeholder={t("Email")}
            ref={register({
              required: {
                value: true,
                message: "Please enter an email address.",
              },
            })}
            type={"email"}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <Input
            aria-label={"Password"}
            isDisabled={isLoading}
            name={"password"}
            placeholder={t("Password")}
            ref={register({
              required: {
                value: true,
                message: "Please enter a password.",
              },
              minLength: {
                value: 5,
                message:
                  "Password is too short. (must be at least 5 characters)",
              },
            })}
            type={"password"}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <HStack spacing={4}>
          <Button
            colorScheme={"primary"}
            isDisabled={isLoading}
            isLoading={isLoadingCreateUser}
            loadingText={t("Sign Up")}
            onClick={handleSubmit(onSubmitCreateUser)}
            type={"submit"}
            variant={"outline"}
          >
            {t("Sign Up")}
          </Button>
          <Button
            colorScheme={"primary"}
            flex={1}
            isDisabled={isLoading}
            isLoading={isLoadingLogin}
            loadingText={t("Login")}
            onClick={handleSubmit(onSubmitLogin)}
            type={"submit"}
            variant={"outline"}
          >
            {t("Login")}
          </Button>
        </HStack>
      </Stack>
    </Stack>
  )
}
