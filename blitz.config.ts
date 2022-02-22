import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import packageJSON from "./package.json"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "flitz",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  log: { level: "info" },
  env: {
    SENTRY_RELEASE: `flitz@${packageJSON.version}`,
  },
}

module.exports = config
