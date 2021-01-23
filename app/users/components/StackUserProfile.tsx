import { HStack, Link as LinkText, Stack, Text } from "@chakra-ui/react"
import { Link } from "blitz"
import React, { FunctionComponent } from "react"

type Props = {
  biography: string
  createdAt: Date
  followeesCount: number
  followersCount: number
  username: string
}

export const StackUserProfile: FunctionComponent<Props> = ({
  biography,
  createdAt,
  followeesCount,
  followersCount,
  username,
}) => {
  return (
    <Stack pacing={2}>
      <Stack>
        <Text fontWeight={"bold"}>{biography}</Text>
      </Stack>
      <HStack align={"center"} spacing={2}>
        <Text color={"gray.500"} fontSize={"sm"}>
          {"CreatedAt"}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"}>
          {createdAt.toDateString()}
        </Text>
      </HStack>
      <HStack align={"center"} spacing={4}>
        <Link href={`/${username}/followees`} passHref>
          <LinkText color={"gray.500"} fontWeight={"bold"}>
            {`${followeesCount} Following`}
          </LinkText>
        </Link>
        <Link href={`/${username}/followers`} passHref>
          <LinkText color={"gray.500"} fontWeight={"bold"}>
            {`${followersCount} Followers`}
          </LinkText>
        </Link>
      </HStack>
    </Stack>
  )
}
