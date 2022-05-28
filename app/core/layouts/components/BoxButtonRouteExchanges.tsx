import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import checkUnreadMessages from "app/exchanges/queries/checkUnreadMessages"
import { useQuery } from "blitz"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiMail } from "react-icons/fi"

type Props = {
  isActive: boolean
  onClick?(): void
}

export const BoxButtonRouteExchanges: FC<Props> = (props) => {
  const { t } = useTranslation()

  const [hasUnreadMessages] = useQuery(checkUnreadMessages, null, {
    refetchInterval: 1000 * 2 ** 4,
  })

  return (
    <BoxButtonRoute icon={FiMail} hasBadge={hasUnreadMessages} {...props}>
      {t("Messages")}
    </BoxButtonRoute>
  )
}
