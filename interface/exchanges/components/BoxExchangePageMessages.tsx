import { useParam } from "@blitzjs/next"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { List, ListItem } from "@chakra-ui/react"
import { FC, useEffect } from "react"
import { BoxExchangeTextarea } from "interface/exchanges/components/BoxExchangePageTextarea"
import { BoxCardMessageLeft } from "interface/exchanges/components/BoxMessageBlockLeft"
import { BoxCardMessageRight } from "interface/exchanges/components/BoxMessageBlockRight"
import { useMessageBlocks } from "interface/exchanges/hooks/useMessageBlocks"
import getMessages from "integrations/queries/getMessages"

export const BoxExchangeMessages: FC = () => {
  const recipientId = useParam("recipientId", "string")

  const [pages, { refetch }] = useInfiniteQuery(
    getMessages,
    (page = { skip: 0, recipientId }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
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
