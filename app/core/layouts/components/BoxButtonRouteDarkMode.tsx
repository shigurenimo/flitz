import { useColorMode } from "@chakra-ui/react"
import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiMoon, FiSun } from "react-icons/fi"

export const BoxButtonRouteDarkMode: FC = () => {
  const { t } = useTranslation()

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <BoxButtonRoute
      icon={colorMode === "light" ? FiSun : FiMoon}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? t("Light Mode") : t("Dark Mode")}
    </BoxButtonRoute>
  )
}
