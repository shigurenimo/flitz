import {
  Button,
  HStack,
  Icon,
  Image,
  Stack,
  AspectRatio,
  useToast,
} from "@chakra-ui/react"
import { AvatarUser } from "app/components/AvatarUser"
import { TextareaAutosize } from "app/components/TextareaAutosize"
import createPost from "app/posts/mutations/createPost"
import { useMutation, useSession } from "blitz"
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { FiImage, FiSend } from "react-icons/fi"

export const HomePageInput: FunctionComponent = () => {
  const session = useSession()

  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const [createPostMutation, { isLoading }] = useMutation(createPost)

  const toast = useToast()

  const selectFile = useFileSelect({ accept: "image/*" })

  const onSelectImage = async () => {
    const files = await selectFile()
    setImage(files[0])
  }

  const onCreatePost = async () => {
    try {
      await createPostMutation({ text })
      setText("")
      toast({ status: "success", title: "Success" })
    } catch (error) {
      toast({ status: "error", title: error.message })
    }
  }

  const isDisabled = text.trim().length === 0

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
                <FileLoader
                  key={`${image.name}-${image.lastModified}`}
                  file={image}
                  render={(url) => (
                    <Image
                      src={url}
                      borderRadius={"md"}
                      style={{
                        filter: "brightness(0.5)",
                      }}
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

const FileLoader: FunctionComponent<{
  file: File
  render(url: string): React.ReactElement
}> = (props) => {
  const url = useObjectURL(props.file)

  return props.render(url)
}

const useFileSelect = (options?: { accept?: string; multiple?: boolean }) => {
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    const input = document.createElement("input")
    input.type = "file"
    inputRef.current = input
  }, [])

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    input.accept = options?.accept || ""
    input.multiple = options?.multiple || false
  }, [options?.accept, options?.multiple])

  const select = useCallback(() => {
    const input = inputRef.current!

    input.value = ""

    return new Promise<File[]>((resolve) => {
      input.addEventListener(
        "change",
        () => resolve(Array.from(input.files || [])),
        { once: true }
      )
      input.click()
    })
  }, [])

  return select
}

const useObjectURL = (object: Blob) => {
  const [url] = useState(() => URL.createObjectURL(object))

  useUnmount(() => URL.revokeObjectURL(url))

  return url
}

const useUnmount = (callback: () => void) => {
  const callbackRef = useRef<() => void>()

  callbackRef.current = callback

  useEffect(() => () => callbackRef.current!(), [])
}
