import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackMessageDate } from "app/exchanges/components/StackMessageDate"
import { MessageBlock } from "app/exchanges/types/messageBlock"
import React, { FunctionComponent } from "react"

type Props = MessageBlock

export const StackCardMessageRight: FunctionComponent<Props> = ({
  createdAt,
  hasAvatar,
  hasTime,
  text,
  userId,
  userName,
}) => {
  return (
    <StackCard py={userId ? 2 : 2}>
      <HStack align={"start"} spacing={4}>
        <Stack spacing={2} w={"full"}>
          {hasAvatar && (
            <Text
              align={"right"}
              fontSize={"lg"}
              fontWeight={"bold"}
              lineHeight={1}
            >
              {userName}
            </Text>
          )}
          <Text
            align={"right"}
            fontSize={"xl"}
            fontWeight={"bold"}
            lineHeight={1}
            whiteSpace={"pre-wrap"}
          >
            {text}
          </Text>
          {hasTime && (
            <StackMessageDate justify={"flex-end"} createdAt={createdAt} />
          )}
        </Stack>
        {hasAvatar ? (
          <Box minW={12}>
            <AvatarUser userId={userId} />
          </Box>
        ) : (
          <Box minW={12} />
        )}
      </HStack>
    </StackCard>
  )
}
