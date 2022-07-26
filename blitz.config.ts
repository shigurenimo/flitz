import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import packageJSON from "./package.json"
import "reflect-metadata"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "flitz",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  log: { level: "error" },
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: `flitz@${packageJSON.version}`,
  },
}

module.exports = config
