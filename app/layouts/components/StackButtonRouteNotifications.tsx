import { StackButtonRoute } from "app/layouts/components/StackButtonRoute"
import checkUnreadNotifications from "app/notifications/queries/checkUnreadNotifications"
import { useQuery } from "blitz"
import React, { FunctionComponent } from "react"
import { FiBell } from "react-icons/fi"

type Props = {
  isActive: boolean
  onClick?: () => void
}

export const StackButtonRouteNotifications: FunctionComponent<Props> = ({
  ...props
}) => {
  const [hasBadge] = useQuery(checkUnreadNotifications, null, {
    refetchInterval: 2000,
  })

  return (
    <StackButtonRoute icon={FiBell} hasBadge={hasBadge} {...props}>
      {"Notifications"}
    </StackButtonRoute>
  )
}
