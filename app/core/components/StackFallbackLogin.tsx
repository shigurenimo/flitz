import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react"
import createUser from "app/home/mutations/createUser"
import login from "app/home/mutations/login"
import { useMutation } from "blitz"
import React, { FunctionComponent } from "react"
import { useForm } from "react-hook-form"

export const StackFallbackLogin: FunctionComponent = () => {
  const [loginMutation, { isLoading: isLoadingLogin }] = useMutation(login)

  const [createUserMutation, { isLoading: isLoadingCreateUser }] =
    useMutation(createUser)

  const onLogin = async (email: string, password: string) => {
    await loginMutation({ email, password })
    window.location.reload()
  }

  const onCreateUser = async (email: string, password: string) => {
    await createUserMutation({ email, password })
    window.location.reload()
  }

  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
  })

  const toast = useToast()

  const onSubmitCreateUser = async (values: {
    email: string
    password: string
  }) => {
    try {
      await onCreateUser(values.email, values.password)
    } catch (error: any) {
      setError("email", { message: "" })
      setError("password", { message: "" })
      toast({ description: error?.message, status: "error" })
    }
  }

  const onSubmitLogin = async (values: { email: string; password: string }) => {
    try {
      await onLogin(values.email, values.password)
    } catch (error: any) {
      setError("email", { message: "" })
      setError("password", { message: "" })
      toast({ description: error?.message, status: "error" })
    }
  }

  const isLoading = isLoadingCreateUser || isLoadingLogin

  return (
    <Stack px={4} spacing={4}>
      <Stack>
        <Heading size={"lg"}>{"Hello, World!"}</Heading>
      </Stack>
      <Stack
        as={"form"}
        align={"flex-start"}
        direction={{ base: "column", md: "row" }}
        onSubmit={handleSubmit(() => null)}
        spacing={4}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          justify={"flex-end"}
          flex={1}
          spacing={4}
        >
          <FormControl isInvalid={!!formState.errors.email}>
            <Input
              aria-label={"Email"}
              isDisabled={isLoading}
              placeholder={"Email"}
              {...register("email", {
                required: "Please enter an email address.",
              })}
              type={"email"}
            />
            <FormErrorMessage>
              {formState.errors.email?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formState.errors.password}>
            <Input
              aria-label={"Password"}
              isDisabled={isLoading}
              placeholder={"Password"}
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
        </Stack>
        <HStack justify={"flex-end"}>
          <HStack spacing={4} w={"full"} maxW={80}>
            <Button
              colorScheme={"primary"}
              isDisabled={isLoading}
              isLoading={isLoadingCreateUser}
              loadingText={"Sign Up"}
              onClick={handleSubmit(onSubmitCreateUser)}
              type={"submit"}
              variant={"outline"}
            >
              {"Sign Up"}
            </Button>
            <Button
              colorScheme={"primary"}
              flex={1}
              isDisabled={isLoading}
              isLoading={isLoadingLogin}
              loadingText={"Login"}
              onClick={handleSubmit(onSubmitLogin)}
              type={"submit"}
              variant={"outline"}
            >
              {"Login"}
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Stack>
  )
}
