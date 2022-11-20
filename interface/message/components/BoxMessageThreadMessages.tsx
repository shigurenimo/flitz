import { useParam } from "@blitzjs/next"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { List, ListItem } from "@chakra-ui/react"
import { FC, useEffect } from "react"
import getMessages from "app/queries/getMessages"
import { BoxBoxMessageThreadTextarea } from "interface/message/components/BoxBoxMessageThreadTextarea"
import { BoxCardMessageLeft } from "interface/message/components/BoxMessageBlockLeft"
import { BoxCardMessageRight } from "interface/message/components/BoxMessageBlockRight"
import { useMessageBlocks } from "interface/message/hooks/useMessageBlocks"

export const BoxMessageThreadMessages: FC = () => {
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
      <BoxBoxMessageThreadTextarea refetch={refetch} />
    </>
  )
}
