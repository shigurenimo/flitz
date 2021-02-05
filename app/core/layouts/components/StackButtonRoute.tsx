import {
  Avatar,
  AvatarBadge,
  Button,
  ButtonProps,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import React, { FunctionComponent } from "react"
import { IconType } from "react-icons"

type Props = ButtonProps & {
  hasBadge?: boolean
  icon: IconType
}

export const StackButtonRoute: FunctionComponent<Props> = ({
  children,
  icon,
  hasBadge,
  ...props
}) => {
  const color = useColorModeValue("", "white")

  return (
    <Stack>
      <Button
        justifyContent={"start"}
        leftIcon={
          <Avatar
            bg={""}
            size={"sm"}
            icon={<Icon as={icon} color={color} fontSize={"xl"} />}
          >
            {hasBadge && <AvatarBadge boxSize={"1em"} bg={"primary.500"} />}
          </Avatar>
        }
        pl={2}
        py={6}
        transitionProperty={"background"}
        variant={"ghost"}
        w={"full"}
        {...props}
      >
        {children}
      </Button>
    </Stack>
  )
}
