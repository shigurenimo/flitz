import { StackButtonRoute } from "app/core/layouts/components/StackButtonRoute"
import checkUnreadMessages from "app/exchanges/queries/checkUnreadMessages"
import { useQuery } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { FiMail } from "react-icons/fi"

type Props = {
  isActive: boolean
  onClick?: () => void
}

export const StackButtonRouteExchanges: FunctionComponent<Props> = ({
  ...props
}) => {
  const { t } = useTranslation()

  const [hasUnreadMessages] = useQuery(checkUnreadMessages, null, {
    refetchInterval: 1000 * 2 ** 4,
  })

  return (
    <StackButtonRoute icon={FiMail} hasBadge={hasUnreadMessages} {...props}>
      {t("Messages")}
    </StackButtonRoute>
  )
}
