import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiGlobe } from "react-icons/fi"

export const BoxButtonRouteLanguage: FC = () => {
  const { i18n } = useTranslation()

  const onClick = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ja" : "en")
  }

  return (
    <BoxButtonRoute icon={FiGlobe} onClick={onClick}>
      {i18n.language === "en" ? "日本語" : "English"}
    </BoxButtonRoute>
  )
}
