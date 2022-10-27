import { useSession } from "@blitzjs/auth"
import { useMediaQuery } from "@chakra-ui/react"
import { useRouter } from "next/router"
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
import { StackAside } from "interface/core/components/StackAside"
import { BoxButtonRoute } from "interface/core/layouts/components/BoxButtonRoute"
import { BoxButtonRouteDarkMode } from "interface/core/layouts/components/BoxButtonRouteDarkMode"
import { BoxButtonRouteExchanges } from "interface/core/layouts/components/BoxButtonRouteExchanges"
import { BoxButtonRouteLanguage } from "interface/core/layouts/components/BoxButtonRouteLanguage"
import { BoxButtonRouteNotifications } from "interface/core/layouts/components/BoxButtonRouteNotifications"
import { BoxButtonRouteReferences } from "interface/core/layouts/components/BoxButtonRouteReferences"
import { toActiveRoute } from "interface/core/layouts/utils/toActiveRoute"

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
