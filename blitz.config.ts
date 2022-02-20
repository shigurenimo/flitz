import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "flitz",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
}

module.exports = config
