import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import { FC } from "react"
import { AvatarUser } from "interface/core/components/AvatarUser"
import { BoxCard } from "interface/core/components/BoxCard"
import { BoxMessageDate } from "interface/message/components/BoxMessageDate"
import { MessageBlock } from "interface/message/types/messageBlock"

type Props = MessageBlock

export const BoxCardMessageLeft: FC<Props> = (props) => {
  return (
    <BoxCard py={props.userId ? 2 : 2}>
      <HStack align={"start"} spacing={4}>
        {props.hasAvatar ? (
          <Box minW={12}>
            <AvatarUser userId={props.userId} />
          </Box>
        ) : (
          <Box minW={12} />
        )}
        <Stack spacing={2} w={"full"}>
          {props.hasAvatar && (
            <Text fontSize={"lg"} fontWeight={"bold"} lineHeight={1}>
              {props.userName}
            </Text>
          )}
          <Text
            fontSize={"xl"}
            fontWeight={"bold"}
            lineHeight={1}
            whiteSpace={"pre-wrap"}
          >
            {props.text}
          </Text>
          {props.hasTime && <BoxMessageDate createdAt={props.createdAt} />}
        </Stack>
      </HStack>
    </BoxCard>
  )
}
