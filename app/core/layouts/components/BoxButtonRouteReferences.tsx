import { useQuery } from "blitz"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiHome } from "react-icons/fi"
import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import checkUnreadReferences from "app/home/queries/checkUnreadReferences"

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
