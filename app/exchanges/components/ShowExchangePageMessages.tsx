import { List, ListItem } from "@chakra-ui/react"
import { ShowExchangePageTextarea } from "app/exchanges/components/ShowExchangePageTextarea"
import { StackCardMessageLeft } from "app/exchanges/components/StackMessageBlockLeft"
import { StackCardMessageRight } from "app/exchanges/components/StackMessageBlockRight"
import { useMessageBlocks } from "app/exchanges/hooks/useMessageBlocks"
import getMessages from "app/exchanges/queries/getMessages"
import { useInfiniteQuery, useParam } from "blitz"
import React, { useEffect, VFC } from "react"

export const ShowExchangePageMessages: VFC = () => {
  const recipientId = useParam("recipientId", "string")

  const [pages, { refetch }] = useInfiniteQuery(
    getMessages,
    (page = { skip: 0, relatedUserId: recipientId }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 4,
    }
  )

  const messages = pages.flatMap((page) => page.items)

  const blocks = useMessageBlocks(messages, recipientId + "")

  useEffect(() => {
    const y =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    window.scroll(0, y)
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
