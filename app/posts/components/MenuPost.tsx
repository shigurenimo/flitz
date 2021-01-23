import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { useClipboardAndToast } from "app/posts/hooks/useClipboardAndToast"
import React, { FunctionComponent } from "react"
import {
  FiClipboard,
  FiMoreHorizontal,
  FiShare,
  FiTrash2,
} from "react-icons/fi"

type Props = {
  isOwnPost: boolean
  onOpenDialog(): void
}

export const MenuPost: FunctionComponent<Props> = ({
  isOwnPost,
  onOpenDialog,
}) => {
  const hasShareAPI = typeof navigator.share !== "undefined"

  const onShare = () => {
    if (hasShareAPI) {
      navigator.share({
        title: "Flitz",
        url: window.location.href,
      })
    }
  }

  const onCopy = useClipboardAndToast(
    typeof window !== "undefined" ? window.location.href : ""
  )

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<FiMoreHorizontal />}
        isRound
        size={"sm"}
        colorScheme={"gray"}
        variant={"ghost"}
        onClick={(event) => event.stopPropagation()}
      >
        {"Actions"}
      </MenuButton>
      <MenuList>
        {isOwnPost && (
          <MenuItem
            aria-label={"Delete"}
            icon={<FiTrash2 />}
            onClick={(event) => {
              event.stopPropagation()
              onOpenDialog()
            }}
          >
            {"Delete"}
          </MenuItem>
        )}
        {hasShareAPI && (
          <MenuItem
            aria-label={"Share"}
            icon={<FiShare />}
            onClick={(event) => {
              event.stopPropagation()
              onShare()
            }}
          >
            {"Share"}
          </MenuItem>
        )}
        <MenuItem
          aria-label={"Copy link to clipboard"}
          icon={<FiClipboard />}
          onClick={(event) => {
            event.stopPropagation()
            onCopy()
          }}
        >
          {"Copy link to clipboard"}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
