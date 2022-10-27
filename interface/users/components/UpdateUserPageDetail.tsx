import { useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
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
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ButtonFile } from "interface/core/components/ButtonFile"
import { useCloudStorage } from "interface/core/hooks/useCloudStorage"
import { BoxProfileUpdateActions } from "interface/users/components/BoxProfileUpdateActions"
import updateUserProfile from "interface/users/mutations/updateUserProfile"
import getUser from "interface/users/queries/getUser"

type Form = {
  biography: string
  name: string
  siteURL: string
}

export const UpdateUserPageDetail: FC = () => {
  const { t } = useTranslation()

  const [iconImageFile, setIconImage] = useState<File | null>(null)

  const [headerImageFile, setHeaderImage] = useState<File | null>(null)

  const [uploadHeaderFileMutation] = useCloudStorage()

  const [uploadIconFileMutation] = useCloudStorage()

  const username = useParam("username", "string")

  const [user] = useQuery(
    getUser,
    { username: username + "" },
    { refetchOnWindowFocus: false }
  )

  const [updateUserProfileMutation, { isLoading }] =
    useMutation(updateUserProfile)

  const { handleSubmit, register, formState } = useForm<Form>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: user.name ?? "",
      biography: user.biography,
      siteURL: "",
    },
  })

  const toast = useToast()

  const onSubmit = async (values: Form) => {
    try {
      const headerImage = await uploadHeaderFileMutation(headerImageFile)
      const iconImage = await uploadIconFileMutation(iconImageFile)
      await updateUserProfileMutation({
        headerFileId: headerImage.fileId,
        iconFileId: iconImage.fileId,
        biography: values.biography,
        name: values.name,
      })
      toast({ status: "success", title: t`Succeeded in updating` })
    } catch (error) {
      toast({
        description:
          formState.errors.name?.message ||
          formState.errors.biography?.message ||
          "",
        status: "error",
      })
    }
  }

  return (
    <Stack spacing={4}>
      <BoxProfileUpdateActions
        iconFile={iconImageFile}
        headerFile={headerImageFile}
        iconImageId={user.iconImageId}
        headerImageId={user.headerImageId}
        userId={user.id}
      />
      <Stack spacing={4} px={4}>
        <FormControl isInvalid={!!formState.errors.name}>
          <FormLabel>{t`Images`}</FormLabel>
          <HStack spacing={4}>
            <ButtonFile
              aria-label={"Icon Image"}
              isDisabled={isLoading}
              onChange={setIconImage}
            >
              {t`Icon Image`}
            </ButtonFile>
            <ButtonFile
              aria-label={"Header Image"}
              isDisabled={isLoading}
              onChange={setHeaderImage}
            >
              {t`Header Image`}
            </ButtonFile>
          </HStack>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.name}>
          <FormLabel>{t`Name`}</FormLabel>
          <Input
            aria-label={"Name"}
            isDisabled={isLoading}
            placeholder={t`Name`}
            {...register("name", {
              required: t`Please enter an email address`.toString(),
            })}
          />
          <FormErrorMessage>{formState.errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.biography}>
          <FormLabel>{t`Biography`}</FormLabel>
          <Textarea
            aria-label={"Biography"}
            isDisabled={isLoading}
            placeholder={t`Biography`}
            resize={"none"}
            {...register("biography")}
          />
          <FormErrorMessage>
            {formState.errors.biography?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>{t`Web site`}</FormLabel>
          <Input
            aria-label={"SiteURL"}
            isDisabled={isLoading}
            placeholder={"https://"}
            type={"url"}
            {...register("siteURL")}
          />
          <FormErrorMessage>
            {formState.errors.siteURL?.message}
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
