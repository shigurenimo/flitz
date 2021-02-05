import {
  Box,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react"
import { StackCard } from "app/core/components/StackCard"
import { ButtonPostAction } from "app/posts/components/ButtonPostAction"
import React, { FunctionComponent } from "react"
import { FiHeart, FiMessageCircle, FiRepeat, FiShare } from "react-icons/fi"

export const StackCardPostSkeleton: FunctionComponent = () => {
  return (
    <StackCard>
      <HStack align={"start"} spacing={4}>
        <Box h={12} w={12}>
          <SkeletonCircle size={"12"} />
        </Box>
        <Stack spacing={4} w={"full"} pt={2}>
          <HStack spacing={2}>
            <SkeletonText noOfLines={3} spacing={"4"} w={"full"} />
          </HStack>
          <HStack spacing={2}>
            <ButtonPostAction
              aria-label={"Repost"}
              isDisabled={true}
              leftIcon={<Icon as={FiRepeat} />}
            >
              <Skeleton>{"01"}</Skeleton>
            </ButtonPostAction>
            <ButtonPostAction
              aria-label={"Like"}
              isDisabled={true}
              leftIcon={<Icon as={FiHeart} />}
            >
              <Skeleton>{"01"}</Skeleton>
            </ButtonPostAction>
            <ButtonPostAction
              aria-label={"Reply"}
              isDisabled={true}
              leftIcon={<Icon as={FiMessageCircle} />}
            >
              <Skeleton>{"01"}</Skeleton>
            </ButtonPostAction>
            <ButtonPostAction
              aria-label={"Share"}
              isDisabled={true}
              leftIcon={<Icon as={FiShare} />}
            >
              {"URL"}
            </ButtonPostAction>
          </HStack>
        </Stack>
      </HStack>
    </StackCard>
  )
}
