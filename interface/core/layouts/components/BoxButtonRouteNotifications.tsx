import { useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiBell } from "react-icons/fi"
import { BoxButtonRoute } from "interface/core/layouts/components/BoxButtonRoute"
import checkUnreadNotifications from "interface/notifications/queries/checkUnreadNotifications"

type Props = {
  isActive: boolean
  onClick?(): void
}

export const BoxButtonRouteNotifications: FC<Props> = (props) => {
  const { t } = useTranslation()

  const [hasBadge] = useQuery(checkUnreadNotifications, null, {
    refetchInterval: 1000 * 2 ** 4,
  })

  return (
    <BoxButtonRoute icon={FiBell} hasBadge={hasBadge} {...props}>
      {t("Notifications")}
    </BoxButtonRoute>
  )
}
