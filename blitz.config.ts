import { sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

module.exports = {
  log: { level: "error" },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "flitz",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
}
