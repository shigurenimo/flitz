import { usePaginatedQuery } from "@blitzjs/rpc"
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  StackDivider,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import getExchanges from "integrations/queries/getExchanges"
import { StackList } from "interface/core/components/StackList"
import { BoxCardExchange } from "interface/exchanges/components/BoxCardExchange"

const ITEMS_PER_PAGE = 20

export const BoxExchangeList: FC = () => {
  const { t } = useTranslation()

  const router = useRouter()

  const page = Number(router.query.page) || 0

  const [{ items: messageThreads, hasMore, count }] = usePaginatedQuery(
    getExchanges,
    { skip: ITEMS_PER_PAGE * page }
  )

  const onPreviousPage = () => {
    router.push({ query: { page: page - 1 } })
  }

  const onNextPage = () => {
    router.push({ query: { page: page + 1 } })
  }

  const onMoveExchangePage = (
    messageThreadId: string,
    relatedUserId: string | null
  ) => {
    if (relatedUserId === null) {
      router.push(`/exchanges/${messageThreadId}`)
      return
    }

    router.push(`/exchanges/-/${relatedUserId}`)
  }

  return (
    <StackList divider={<StackDivider />}>
      {count === 0 && (
        <Box px={4}>
          <Alert status={"info"}>
            <AlertIcon />
            {t("No Exchanges")}
          </Alert>
        </Box>
      )}
      {messageThreads.map((messageThread) => (
        <BoxCardExchange
          {...messageThread}
          key={messageThread.id}
          onClick={() => {
            onMoveExchangePage(messageThread.id, messageThread.relatedUser.id)
          }}
        />
      ))}
      <HStack spacing={4}>
        <Button isDisabled={count === 0 || page === 0} onClick={onPreviousPage}>
          {"Previuos"}
        </Button>
        <Button isDisabled={!hasMore} onClick={onNextPage}>
          {"Next"}
        </Button>
      </HStack>
    </StackList>
  )
}
