import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { ButtonFile } from "app/core/components/ButtonFile"
import { ConvertFile } from "app/core/utils/convertFile"
import { StackProfileUpdateActions } from "app/users/components/StackProfileUpdateActions"
import updateUserProfile from "app/users/mutations/updateUserProfile"
import getUser from "app/users/queries/getUser"
import { useMutation, useParam, useQuery } from "blitz"
import React, { FunctionComponent, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

export const UpdateUserPageDetail: FunctionComponent = () => {
  const { t } = useTranslation()

  const [iconImageFile, setIconImage] = useState<File | null>(null)

  const [headerImageFile, setHeaderImage] = useState<File | null>(null)

  const username = useParam("username", "string")

  const [user] = useQuery(
    getUser,
    { username: username + "" },
    { refetchOnWindowFocus: false }
  )

  const [updateUserProfileMutation, { isLoading }] = useMutation(
    updateUserProfile
  )

  const { handleSubmit, errors, register } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: user.name,
      biography: user.biography,
    },
  })

  const toast = useToast()

  const onSubmit = async (values: {
    biography: string
    name: string
    siteURL: string
  }) => {
    try {
      const convertFileService = new ConvertFile()

      await updateUserProfileMutation({
        headerImage: await convertFileService.execute(headerImageFile),
        iconImage: await convertFileService.execute(iconImageFile),
        biography: values.biography,
        name: values.name,
      })
      toast({ status: "success", title: t`Succeeded in updating` })
    } catch (error) {
      toast({ description: error.message, status: "error" })
    }
  }

  return (
    <Stack spacing={4}>
      <StackProfileUpdateActions
        iconImageFile={iconImageFile}
        headerImageFile={headerImageFile}
        {...user}
      />
      <Stack spacing={4} px={4}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t`Images`}</FormLabel>
          <HStack spacing={4}>
            <ButtonFile
              aria-label={"Icon Image"}
              isDisabled={isLoading}
              onChange={(file) => setIconImage(file)}
            >
              {t`Icon Image`}
            </ButtonFile>
            <ButtonFile
              aria-label={"Header Image"}
              isDisabled={isLoading}
              onChange={(file) => setHeaderImage(file)}
            >
              {t`Header Image`}
            </ButtonFile>
          </HStack>
        </FormControl>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>{t`Name`}</FormLabel>
          <Input
            aria-label={"Name"}
            isDisabled={isLoading}
            name={"name"}
            placeholder={t`Name`}
            ref={register({
              required: {
                value: true,
                message: t`Please enter an email address`,
              },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.biography}>
          <FormLabel>{t`Biography`}</FormLabel>
          <Textarea
            aria-label={"Biography"}
            isDisabled={isLoading}
            name={"biography"}
            placeholder={t`Biography`}
            resize={"none"}
            ref={register({})}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>{t`Web site`}</FormLabel>
          <Input
            aria-label={"SiteURL"}
            isDisabled={isLoading}
            name={"siteURL"}
            placeholder={"https://"}
            ref={register({})}
            type={"url"}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Box pt={4}>
          <Button
            colorScheme={"primary"}
            isLoading={isLoading}
            loadingText={t`Update`}
            onClick={handleSubmit(onSubmit)}
            variant={"outline"}
            w={"full"}
          >
            {t`Update`}
          </Button>
        </Box>
      </Stack>
    </Stack>
  )
}
