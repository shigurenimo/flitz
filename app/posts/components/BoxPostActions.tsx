import { HStack, Icon, useToast } from "@chakra-ui/react"
import { useMutation, useRouter } from "blitz"
import { FC } from "react"
import { FiHeart, FiMessageCircle, FiRepeat } from "react-icons/fi"
import { ButtonPostAction } from "app/posts/components/ButtonPostAction"
import createPostLike from "app/posts/mutations/createPostLike"
import createQuotation from "app/posts/mutations/createQuotation"
import deletePostLike from "app/posts/mutations/deletePostLike"

type Props = {
  hasLike: boolean
  hasQuotation: boolean
  hasReply: boolean
  isDisabled: boolean
  likesCount: number
  postId: string
  quotationsCount: number
  repliesCount: number
  text: string | null
}

export const BoxPostActions: FC<Props> = (props) => {
  const router = useRouter()

  const toast = useToast()

  const [createPostLikeMutation, { isLoading: isLoadingCreatePostLike }] =
    useMutation(createPostLike)

  const [deletePostLikeMutation, { isLoading: isLoadingDeletePostLike }] =
    useMutation(deletePostLike)

  const [createQuotationMutation, { isLoading: isLoadingCreateQuotation }] =
    useMutation(createQuotation)

  const onCreateReply = () => {
    router.push(`/posts/${props.postId}`)
  }

  const onCreateLike = async () => {
    try {
      if (props.hasLike) {
        await deletePostLikeMutation({ postId: props.postId })
      } else {
        await createPostLikeMutation({ postId: props.postId })
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const onCreateQuotation = async () => {
    try {
      await createQuotationMutation({ postId: props.postId })
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  return (
    <HStack spacing={2}>
      <ButtonPostAction
        aria-label={"Repost"}
        isActive={!props.isDisabled && props.hasQuotation}
        isDisabled={props.isDisabled || isLoadingCreateQuotation}
        leftIcon={<Icon as={FiRepeat} display={"flex"} />}
        onClick={onCreateQuotation}
      >
        {props.quotationsCount}
      </ButtonPostAction>
      <ButtonPostAction
        aria-label={"Like"}
        isActive={!props.isDisabled && props.hasLike}
        isDisabled={
          props.isDisabled || isLoadingDeletePostLike || isLoadingCreatePostLike
        }
        leftIcon={<Icon as={FiHeart} display={"flex"} />}
        onClick={onCreateLike}
      >
        {props.likesCount}
      </ButtonPostAction>
      <ButtonPostAction
        aria-label={"Reply"}
        isActive={props.hasReply}
        leftIcon={<Icon as={FiMessageCircle} display={"flex"} />}
        onClick={onCreateReply}
      >
        {props.repliesCount}
      </ButtonPostAction>
    </HStack>
  )
}
