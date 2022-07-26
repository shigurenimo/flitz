import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react"
import { AuthenticationError, useMutation, useRouter } from "blitz"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import createUser from "app/home/mutations/createUser"
import login from "app/home/mutations/login"

export const BoxHomeLogin: FC = () => {
  const { t } = useTranslation()

  const router = useRouter()

  const [loginMutation, { isLoading: isLoadingLogin }] = useMutation(login)

  const [createUserMutation, { isLoading: isLoadingCreateUser }] =
    useMutation(createUser)

  const onLogin = async (email: string, password: string) => {
    await loginMutation({ email, password })
    router.push("/")
  }

  const onCreateUser = async (email: string, password: string) => {
    await createUserMutation({ email, password })
    router.push("/")
  }

  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
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

      if (formState.errors.password?.message) {
        setError("password", { message: formState.errors.password?.message })
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

      if (formState.errors.password?.message) {
        setError("password", { message: formState.errors.password?.message })
        return
      }

      setError("password", { message: "An unknown error has occurred" })
    }
  }

  const isLoading = isLoadingCreateUser || isLoadingLogin

  return (
    <Stack maxW={{ base: "none", lg: 80 }} spacing={8} w={"full"} px={4}>
      <Stack as={"form"} onSubmit={handleSubmit(() => null)} spacing={4}>
        <FormControl isInvalid={!!formState.errors.email}>
          <Input
            aria-label={"Email"}
            isDisabled={isLoading}
            placeholder={t("Email")}
            type={"email"}
            {...register("email", {
              required: "Please enter an email address.",
            })}
          />
          <FormErrorMessage>{formState.errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.password}>
          <Input
            aria-label={"Password"}
            isDisabled={isLoading}
            placeholder={t("Password")}
            {...register("password", {
              required: "Please enter a password.",
              minLength: {
                value: 5,
                message:
                  "Password is too short. (must be at least 5 characters)",
              },
            })}
            type={"password"}
          />
          <FormErrorMessage>
            {formState.errors.password?.message}
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
