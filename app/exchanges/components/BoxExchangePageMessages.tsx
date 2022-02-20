import { List, ListItem } from "@chakra-ui/react"
import { BoxExchangeTextarea } from "app/exchanges/components/BoxExchangePageTextarea"
import { BoxCardMessageLeft } from "app/exchanges/components/BoxMessageBlockLeft"
import { BoxCardMessageRight } from "app/exchanges/components/BoxMessageBlockRight"
import { useMessageBlocks } from "app/exchanges/hooks/useMessageBlocks"
import getMessages from "app/exchanges/queries/getMessages"
import { useInfiniteQuery, useParam } from "blitz"
import React, { useEffect, VFC } from "react"

export const BoxExchangeMessages: VFC = () => {
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
            {block.align === "left" && <BoxCardMessageLeft {...block} />}
            {block.align === "right" && <BoxCardMessageRight {...block} />}
          </ListItem>
        ))}
      </List>
      <BoxExchangeTextarea refetch={refetch} />
    </>
  )
}
