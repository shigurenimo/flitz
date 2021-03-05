const { sessionMiddleware, simpleRolesIsAuthorized } = require("blitz")

module.exports = {
  log: { level: "error" },
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
}
