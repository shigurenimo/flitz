import checkUnreadReferences from "app/home/queries/checkUnreadReferences"
import { StackButtonRoute } from "app/layouts/components/StackButtonRoute"
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
    refetchInterval: 2000,
  })

  return (
    <StackButtonRoute icon={FiHome} hasBadge={hasBadge} {...props}>
      {t("Home")}
    </StackButtonRoute>
  )
}
