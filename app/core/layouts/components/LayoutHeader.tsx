import {
  Box,
  Flex,
  HStack,
  Stack,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react"
import { StackButtonRoute } from "app/core/layouts/components/StackButtonRoute"
import { StackButtonRouteDarkMode } from "app/core/layouts/components/StackButtonRouteDarkMode"
import { StackButtonRouteExchanges } from "app/core/layouts/components/StackButtonRouteExchanges"
import { StackButtonRouteLanguage } from "app/core/layouts/components/StackButtonRouteLanguage"
import { StackButtonRouteNotifications } from "app/core/layouts/components/StackButtonRouteNotifications"
import { StackButtonRouteReferences } from "app/core/layouts/components/StackButtonRouteReferences"
import { toActiveRoute } from "app/core/layouts/utils/toActiveRoute"
import { useRouter, useSession } from "blitz"
import React, { FunctionComponent, Suspense } from "react"
import { useTranslation } from "react-i18next"
import {
  FiBell,
  FiGithub,
  FiHome,
  FiMail,
  FiSettings,
  FiUser,
  FiZap,
} from "react-icons/fi"

export const LayoutHeader: FunctionComponent = () => {
  const bg = useColorModeValue("white", "gray.800")

  const { t } = useTranslation()

  const router = useRouter()

  const session = useSession()

  const [isMobile] = useMediaQuery("(max-width: 48em)")

  const activeRoute = toActiveRoute(router.pathname)

  if (session.isLoading) {
    return null
  }

  if (!isMobile) {
    return null
  }

  return (
    <Stack
      align={"center"}
      as={"header"}
      bg={bg}
      overflowX={"auto"}
      pb={{ base: 4, md: 6 }}
      position={"sticky"}
      pt={{ base: 4, md: 8 }}
      px={{ base: 0, md: 4 }}
      top={0}
      w={"full"}
      zIndex={50}
      display={{ base: "flex", md: "none" }}
    >
      <Flex alignSelf={"center"} w={"full"}>
        <HStack alignSelf={"center"} spacing={4} w={"full"} pl={4}>
          <StackButtonRoute
            isActive={activeRoute === "about"}
            icon={FiGithub}
            onClick={() => router.push("/about")}
          >
            {t("FLITZ")}
          </StackButtonRoute>
          {session.userId === null && (
            <StackButtonRoute
              isActive={activeRoute === "home"}
              icon={FiHome}
              onClick={() => router.push("/")}
            >
              {t("Home")}
            </StackButtonRoute>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <StackButtonRoute
                  isActive={activeRoute === "home"}
                  icon={FiHome}
                  onClick={() => router.push("/")}
                >
                  {t("Home")}
                </StackButtonRoute>
              }
            >
              <StackButtonRouteReferences
                isActive={activeRoute === "home"}
                onClick={() => router.push("/")}
              />
            </Suspense>
          )}
          {session.userId && (
            <StackButtonRoute
              isActive={activeRoute === "posts"}
              icon={FiZap}
              onClick={() => router.push("/posts")}
            >
              {t("Stream")}
            </StackButtonRoute>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <StackButtonRoute disabled icon={FiBell}>
                  {t("Notifications")}
                </StackButtonRoute>
              }
            >
              <StackButtonRouteNotifications
                isActive={activeRoute === "notifications"}
                onClick={() => router.push("/notifications")}
              />
            </Suspense>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <StackButtonRoute disabled icon={FiMail}>
                  {t("Messages")}
                </StackButtonRoute>
              }
            >
              <StackButtonRouteExchanges
                isActive={activeRoute === "exchanges"}
                onClick={() => router.push("/exchanges")}
              />
            </Suspense>
          )}
          {session.userId && (
            <StackButtonRoute
              icon={FiUser}
              isActive={activeRoute === "users"}
              onClick={() => router.push(`/${session.username}`)}
            >
              {t("Profile")}
            </StackButtonRoute>
          )}
          {session.userId && (
            <StackButtonRoute
              icon={FiSettings}
              isActive={activeRoute === "settings"}
              onClick={() => router.push("/settings")}
            >
              {t("Settings")}
            </StackButtonRoute>
          )}
          <StackButtonRouteLanguage />
          <Box pr={4}>
            <StackButtonRouteDarkMode />
          </Box>
        </HStack>
      </Flex>
    </Stack>
  )
}
