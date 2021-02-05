import { useColorMode } from "@chakra-ui/react"
import { StackButtonRoute } from "app/core/layouts/components/StackButtonRoute"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { FiMoon, FiSun } from "react-icons/fi"

export const StackButtonRouteDarkMode: FunctionComponent = () => {
  const { t } = useTranslation()

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <StackButtonRoute
      icon={colorMode === "light" ? FiSun : FiMoon}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? t("Light Mode") : t("Dark Mode")}
    </StackButtonRoute>
  )
}
