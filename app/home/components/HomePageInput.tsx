import {
  AspectRatio,
  Button,
  HStack,
  Icon,
  Image,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { RenderFileLoader } from "app/components/RenderFileLoader"
import { TextareaAutosize } from "app/components/TextareaAutosize"
import { useFileSelect } from "app/hooks/useFileSelect"
import createPost from "app/posts/mutations/createPost"
import { useMutation, useSession } from "blitz"
import React, { FunctionComponent, useState } from "react"
import { FiImage, FiSend } from "react-icons/fi"
import { ClientFileService } from "services/clientFileService"

export const HomePageInput: FunctionComponent = () => {
  const session = useSession()

  const [text, setText] = useState("")

  const [image, setImage] = useState<File | null>(null)

  const [createPostMutation, { isLoading }] = useMutation(createPost)

  const toast = useToast()

  const selectFile = useFileSelect({ accept: "image/*" })

  const onSelectImage = async () => {
    const [file] = await selectFile()
    setImage(file)
  }

  const onCreatePost = async () => {
    try {
      // Upload images by base64 because blitz mutations does not accept Files
      // See https://github.com/blitz-js/blitz/issues/843
      const encodedImage = await ClientFileService.convertFileToBase64(image)
      await createPostMutation({ text, image: encodedImage })
      setText("")
      setImage(null)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const isDisabled = text.trim().length === 0 || !image

  return (
    <Stack spacing={4} px={4}>
      <HStack w={"full"} spacing={4} align={"flex-start"}>
        <AvatarUser userId={session.userId} />
        <Stack w={"full"} spacing={4} align={"flex-start"}>
          <TextareaAutosize
            isDisabled={isLoading}
            onChange={(event) => setText(event.target.value)}
            placeholder={"Here is a sample placeholder"}
            minRows={2}
            value={text}
            w={"full"}
          />
          {image && (
            <HStack w={"full"}>
              <AspectRatio w={"full"} ratio={1 / 0.5625}>
                <RenderFileLoader
                  key={`${image.name}-${image.lastModified}`}
                  file={image}
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
        <Button
          aria-label={"Image"}
          isDisabled={isLoading}
          leftIcon={<Icon as={FiImage} fontSize={"xl"} />}
          onClick={() => onSelectImage()}
          variant={"outline"}
        >
          {"Image"}
        </Button>
        <Button
          aria-label={"Submit"}
          isDisabled={isDisabled}
          isLoading={isLoading}
          leftIcon={<Icon as={FiSend} />}
          loadingText={"Post"}
          onClick={() => onCreatePost()}
          variant={"outline"}
        >
          {"Post"}
        </Button>
      </HStack>
    </Stack>
  )
}
