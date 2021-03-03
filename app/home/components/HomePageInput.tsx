import {
  AspectRatio,
  Button,
  HStack,
  Icon,
  Image,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { ButtonFile } from "app/core/components/ButtonFile"
import { RenderFileLoader } from "app/core/components/RenderFileLoader"
import { TextareaAutosize } from "app/core/components/TextareaAutosize"
import { ConvertFile } from "app/core/utils/convertFile"
import createPost from "app/posts/mutations/createPost"
import { useMutation, useSession } from "blitz"
import React, { FunctionComponent, useState } from "react"
import { useTranslation } from "react-i18next"
import { FiSend } from "react-icons/fi"

export const HomePageInput: FunctionComponent = () => {
  const session = useSession()

  const { t } = useTranslation()

  const [text, setText] = useState("")

  const [file, setFile] = useState<File | null>(null)

  const [createPostMutation, { isLoading }] = useMutation(createPost)

  const toast = useToast()

  const onCreatePost = async () => {
    const convertFileService = new ConvertFile()

    try {
      const encodedImage = await convertFileService.execute(file)
      await createPostMutation({ text, image: encodedImage })
      setText("")
      setFile(null)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const isDisabled = text.trim().length === 0 && !file

  return (
    <Stack spacing={4} px={4}>
      <HStack w={"full"} spacing={4} align={"flex-start"}>
        <AvatarUser userId={session.userId} fileId={session.iconImageId} />
        <Stack w={"full"} spacing={4} align={"flex-start"}>
          <TextareaAutosize
            isDisabled={isLoading}
            onChange={(event) => setText(event.target.value)}
            placeholder={t`What's happening?`}
            minRows={2}
            value={text}
            w={"full"}
          />
          {file && (
            <HStack w={"full"} bg={"white"} rounded={"md"} overflow={"hidden"}>
              <AspectRatio w={"full"} ratio={1 / 0.5625}>
                <RenderFileLoader
                  key={`${file.name}-${file.lastModified}`}
                  file={file}
                  render={(url) => (
                    <Image
                      src={url}
                      borderRadius={"md"}
                      style={{ filter: "brightness(0.5)" }}
                    />
                  )}
                />
              </AspectRatio>
            </HStack>
          )}
        </Stack>
      </HStack>
      <HStack pl={14} spacing={4} justify={"flex-end"}>
        <ButtonFile
          aria-label={"Image"}
          isDisabled={isLoading}
          onChange={(file) => setFile(file)}
        >
          {t`Image`}
        </ButtonFile>
        <Button
          aria-label={"Submit"}
          isDisabled={isDisabled}
          isLoading={isLoading}
          leftIcon={<Icon as={FiSend} />}
          loadingText={t`Submit`}
          onClick={() => onCreatePost()}
          variant={"outline"}
        >
          {t`Submit`}
        </Button>
      </HStack>
    </Stack>
  )
}
