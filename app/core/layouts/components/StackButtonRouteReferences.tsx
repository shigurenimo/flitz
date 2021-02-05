import { StackButtonRoute } from "app/core/layouts/components/StackButtonRoute"
import checkUnreadReferences from "app/home/queries/checkUnreadReferences"
import { useQuery } from "blitz"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { FiHome } from "react-icons/fi"

type Props = {
  isActive: boolean
  onClick?: () => void
}

export const StackButtonRouteReferences: FunctionComponent<Props> = ({
  ...props
}) => {
  const { t } = useTranslation()

  const [hasBadge] = useQuery(checkUnreadReferences, null, {
    refetchInterval: 1000 * 2 ** 4,
  })

  return (
    <StackButtonRoute icon={FiHome} hasBadge={hasBadge} {...props}>
      {t("Home")}
    </StackButtonRoute>
  )
}
