import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { StackCard } from "app/core/components/StackCard"
import { StackMessageDate } from "app/exchanges/components/StackMessageDate"
import { MessageBlock } from "app/exchanges/types/messageBlock"
import React, { VFC } from "react"

type Props = MessageBlock

export const StackCardMessageRight: VFC<Props> = (props) => {
  return (
    <StackCard py={props.userId ? 2 : 2}>
      <HStack align={"start"} spacing={4}>
        <Stack spacing={2} w={"full"}>
          {props.hasAvatar && (
            <Text
              align={"right"}
              fontSize={"lg"}
              fontWeight={"bold"}
              lineHeight={1}
            >
              {props.userName}
            </Text>
          )}
          <Text
            align={"right"}
            fontSize={"xl"}
            fontWeight={"bold"}
            lineHeight={1}
            whiteSpace={"pre-wrap"}
          >
            {props.text}
          </Text>
          {props.hasTime && (
            <StackMessageDate
              justify={"flex-end"}
              createdAt={props.createdAt}
            />
          )}
        </Stack>
        {props.hasAvatar ? (
          <Box minW={12}>
            <AvatarUser userId={props.userId} />
          </Box>
        ) : (
          <Box minW={12} />
        )}
      </HStack>
    </StackCard>
  )
}
