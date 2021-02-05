import { Stack, useMediaQuery } from "@chakra-ui/react"
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

export const LayoutAside: FunctionComponent = () => {
  const session = useSession()

  const router = useRouter()

  const { t } = useTranslation()

  const [isMobile] = useMediaQuery("(max-width: 48em)")

  const activeRoute = toActiveRoute(router.pathname)

  if (session.isLoading) {
    return null
  }

  if (isMobile) {
    return null
  }

  return (
    <Stack
      as={"aside"}
      bottom={0}
      display={{ base: "none", md: "inherit" }}
      position={"fixed"}
      top={0}
      w={56}
      pl={4}
      py={8}
      zIndex={50}
    >
      <Stack as={"nav"} alignSelf={"center"} spacing={4} w={"full"}>
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
        <StackButtonRoute
          icon={FiZap}
          isActive={activeRoute === "posts"}
          isDisabled={session.userId === null}
          onClick={() => router.push("/posts")}
        >
          {t("Stream")}
        </StackButtonRoute>
        {session.userId === null && (
          <StackButtonRoute isDisabled icon={FiBell}>
            {t("Notifications")}
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
        {session.userId === null && (
          <StackButtonRoute isDisabled icon={FiMail}>
            {t("Messages")}
          </StackButtonRoute>
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
        <StackButtonRoute
          icon={FiUser}
          isActive={activeRoute === "users"}
          isDisabled={session.userId === null}
          onClick={() => router.push(`/${session.username}`)}
        >
          {t("Profile")}
        </StackButtonRoute>
        <StackButtonRoute
          icon={FiSettings}
          isActive={activeRoute === "settings"}
          isDisabled={session.userId === null}
          onClick={() => router.push("/settings")}
        >
          {t("Settings")}
        </StackButtonRoute>
        <StackButtonRouteLanguage />
        <StackButtonRouteDarkMode />
      </Stack>
    </Stack>
  )
}
