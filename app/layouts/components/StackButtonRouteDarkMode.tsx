import { useColorMode } from "@chakra-ui/react"
import { StackButtonRoute } from "app/layouts/components/StackButtonRoute"
import React, { FunctionComponent } from "react"
import { FiMoon, FiSun } from "react-icons/fi"

export const StackButtonRouteDarkMode: FunctionComponent = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <StackButtonRoute
      icon={colorMode === "light" ? FiSun : FiMoon}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? "Light Mode" : "Dark Mode"}
    </StackButtonRoute>
  )
}
