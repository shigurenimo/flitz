import { List, ListItem } from "@chakra-ui/react"
import { ShowExchangePageTextarea } from "app/exchanges/components/ShowExchangePageTextarea"
import { StackCardMessageLeft } from "app/exchanges/components/StackMessageBlockLeft"
import { StackCardMessageRight } from "app/exchanges/components/StackMessageBlockRight"
import { useMessageBlocks } from "app/exchanges/hooks/useMessageBlocks"
import getMessagesInfinite from "app/exchanges/queries/getMessagesInfinite"
import { useInfiniteQuery, useParam } from "blitz"
import React, { FunctionComponent, useEffect } from "react"

export const ShowExchangePageMessages: FunctionComponent = () => {
  const recipientId = useParam("recipientId", "string")

  const [groupedMessages, { refetch }] = useInfiniteQuery(
    getMessagesInfinite,
    (page = { skip: 0, relatedUserId: recipientId }) => page,
    {
      getFetchMore: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const messages = groupedMessages
    .map((group) => group.messages)
    .reduce((a, b) => {
      return [...a, ...b]
    }, [])

  const blocks = useMessageBlocks(messages, recipientId + "")

  useEffect(() => {
    window.scroll(
      0,
      document.documentElement.scrollHeight -
        document.documentElement.clientHeight
    )
  }, [messages.length])

  return (
    <>
      <List position={"relative"}>
        {blocks.map((block) => (
          <ListItem key={block.id}>
            {block.align === "left" && <StackCardMessageLeft {...block} />}
            {block.align === "right" && <StackCardMessageRight {...block} />}
          </ListItem>
        ))}
      </List>
      <ShowExchangePageTextarea refetch={refetch} />
    </>
  )
}
