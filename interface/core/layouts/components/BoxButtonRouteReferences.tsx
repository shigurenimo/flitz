import { useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiHome } from "react-icons/fi"
import checkUnreadReferences from "app/queries/checkUnreadReferences"
import { BoxButtonRoute } from "interface/core/layouts/components/BoxButtonRoute"

type Props = {
  isActive: boolean
  onClick?(): void
}

export const BoxButtonRouteReferences: FC<Props> = (props) => {
  const { t } = useTranslation()

  const [hasBadge] = useQuery(checkUnreadReferences, null, {
    refetchInterval: 1000 * 2 ** 4,
  })

  return (
    <BoxButtonRoute icon={FiHome} hasBadge={hasBadge} {...props}>
      {t("Home")}
    </BoxButtonRoute>
  )
}
