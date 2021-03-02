import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  StackDivider,
} from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import { StackCardExchange } from "app/exchanges/components/StackCardExchange"
import getExchanges from "app/exchanges/queries/getExchanges"
import { usePaginatedQuery, useRouter } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"

const ITEMS_PER_PAGE = 20

export const ExchangesPageList: FunctionComponent = () => {
  const { t } = useTranslation()

  const router = useRouter()

  const page = Number(router.query.page) || 0

  const [{ exchanges, hasMore, isEmpty }] = usePaginatedQuery(getExchanges, {
    skip: ITEMS_PER_PAGE * page,
  })

  const onPreviousPage = () => {
    router.push({ query: { page: page - 1 } })
  }

  const onNextPage = () => {
    router.push({ query: { page: page + 1 } })
  }

  const onMoveExchangePage = (
    exchangeId: string,
    relatedUserId: string | null
  ) => {
    if (relatedUserId === null) {
      router.push(`/exchanges/${exchangeId}`)
      return
    }

    router.push(`/exchanges/-/${relatedUserId}`)
  }

  return (
    <>
      <StackList divider={<StackDivider />}>
        {isEmpty && (
          <Box px={4}>
            <Alert status={"info"}>
              <AlertIcon />
              {t("No Exchanges")}
            </Alert>
          </Box>
        )}
        {exchanges.map((exchange) => (
          <StackCardExchange
            {...exchange}
            key={exchange.id}
            onClick={() => {
              onMoveExchangePage(exchange.id, exchange.relatedUser.id)
            }}
          />
        ))}
        <HStack spacing={4}>
          <Button isDisabled={isEmpty || page === 0} onClick={onPreviousPage}>
            {"Previuos"}
          </Button>
          <Button isDisabled={isEmpty || !hasMore} onClick={onNextPage}>
            {"Next"}
          </Button>
        </HStack>
      </StackList>
    </>
  )
}
