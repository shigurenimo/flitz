import { useMediaQuery } from "@chakra-ui/react"
import { useRouter, useSession } from "blitz"
import { FC, Suspense } from "react"
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
import { StackAside } from "app/core/components/StackAside"
import { BoxButtonRoute } from "app/core/layouts/components/BoxButtonRoute"
import { BoxButtonRouteDarkMode } from "app/core/layouts/components/BoxButtonRouteDarkMode"
import { BoxButtonRouteExchanges } from "app/core/layouts/components/BoxButtonRouteExchanges"
import { BoxButtonRouteLanguage } from "app/core/layouts/components/BoxButtonRouteLanguage"
import { BoxButtonRouteNotifications } from "app/core/layouts/components/BoxButtonRouteNotifications"
import { BoxButtonRouteReferences } from "app/core/layouts/components/BoxButtonRouteReferences"
import { toActiveRoute } from "app/core/layouts/utils/toActiveRoute"

export const LayoutAside: FC = () => {
  const session = useSession()

  const router = useRouter()

  const { t } = useTranslation()

  const [isMobile] = useMediaQuery("(max-width: 48em)")

  const activeRoute = toActiveRoute(router.pathname)

  if (isMobile) {
    return null
  }

  return (
    <StackAside>
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
      <BoxButtonRoute
        icon={FiZap}
        isActive={activeRoute === "posts"}
        isDisabled={session.userId === null}
        onClick={() => router.push("/posts")}
      >
        {t("Stream")}
      </BoxButtonRoute>
      {session.userId === null && (
        <BoxButtonRoute isDisabled icon={FiBell}>
          {t("Notifications")}
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
      {session.userId === null && (
        <BoxButtonRoute isDisabled icon={FiMail}>
          {t("Messages")}
        </BoxButtonRoute>
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
      <BoxButtonRoute
        icon={FiUser}
        isActive={activeRoute === "users"}
        isDisabled={session.userId === null}
        onClick={() => router.push(`/${session.username}`)}
      >
        {t("Profile")}
      </BoxButtonRoute>
      <BoxButtonRoute
        icon={FiSettings}
        isActive={activeRoute === "settings"}
        isDisabled={session.userId === null}
        onClick={() => router.push("/settings")}
      >
        {t("Settings")}
      </BoxButtonRoute>
      <BoxButtonRouteLanguage />
      <BoxButtonRouteDarkMode />
    </StackAside>
  )
}
