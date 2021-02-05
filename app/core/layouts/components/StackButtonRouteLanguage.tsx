import { StackButtonRoute } from "app/core/layouts/components/StackButtonRoute"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { FiGlobe } from "react-icons/fi"

export const StackButtonRouteLanguage: FunctionComponent = () => {
  const { i18n } = useTranslation()

  const onClick = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ja" : "en")
  }

  return (
    <StackButtonRoute icon={FiGlobe} onClick={onClick}>
      {i18n.language === "en" ? "日本語" : "English"}
    </StackButtonRoute>
  )
}
