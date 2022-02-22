import {
  Box,
  Flex,
  HStack,
  Stack,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react"
import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import { BoxButtonRouteDarkMode } from "app/core/layouts/components/BoxButtonRouteDarkMode"
import { BoxButtonRouteExchanges } from "app/core/layouts/components/BoxButtonRouteExchanges"
import { BoxButtonRouteLanguage } from "app/core/layouts/components/BoxButtonRouteLanguage"
import { BoxButtonRouteNotifications } from "app/core/layouts/components/BoxButtonRouteNotifications"
import { BoxButtonRouteReferences } from "app/core/layouts/components/BoxButtonRouteReferences"
import { toActiveRoute } from "app/core/layouts/utils/toActiveRoute"
import { useRouter, useSession } from "blitz"
import React, { Suspense, VFC } from "react"
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

export const LayoutHeader: VFC = () => {
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
          <BoxButtonRoute
            isActive={activeRoute === "about"}
            icon={FiGithub}
            onClick={() => router.push("/about")}
          >
            {t("FLITZ")}
          </BoxButtonRoute>
          {session.userId === null && (
            <BoxButtonRoute
              isActive={activeRoute === "home"}
              icon={FiHome}
              onClick={() => router.push("/")}
            >
              {t("Home")}
            </BoxButtonRoute>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <BoxButtonRoute
                  isActive={activeRoute === "home"}
                  icon={FiHome}
                  onClick={() => router.push("/")}
                >
                  {t("Home")}
                </BoxButtonRoute>
              }
            >
              <BoxButtonRouteReferences
                isActive={activeRoute === "home"}
                onClick={() => router.push("/")}
              />
            </Suspense>
          )}
          {session.userId && (
            <BoxButtonRoute
              isActive={activeRoute === "posts"}
              icon={FiZap}
              onClick={() => router.push("/posts")}
            >
              {t("Stream")}
            </BoxButtonRoute>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <BoxButtonRoute disabled icon={FiBell}>
                  {t("Notifications")}
                </BoxButtonRoute>
              }
            >
              <BoxButtonRouteNotifications
                isActive={activeRoute === "notifications"}
                onClick={() => router.push("/notifications")}
              />
            </Suspense>
          )}
          {session.userId && (
            <Suspense
              fallback={
                <BoxButtonRoute disabled icon={FiMail}>
                  {t("Messages")}
                </BoxButtonRoute>
              }
            >
              <BoxButtonRouteExchanges
                isActive={activeRoute === "exchanges"}
                onClick={() => router.push("/exchanges")}
              />
            </Suspense>
          )}
          {session.userId && (
            <BoxButtonRoute
              icon={FiUser}
              isActive={activeRoute === "users"}
              onClick={() => router.push(`/${session.username}`)}
            >
              {t("Profile")}
            </BoxButtonRoute>
          )}
          {session.userId && (
            <BoxButtonRoute
              icon={FiSettings}
              isActive={activeRoute === "settings"}
              onClick={() => router.push("/settings")}
            >
              {t("Settings")}
            </BoxButtonRoute>
          )}
          <BoxButtonRouteLanguage />
          <Box pr={4}>
            <BoxButtonRouteDarkMode />
          </Box>
        </HStack>
      </Flex>
    </Stack>
  )
}