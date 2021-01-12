const { sessionMiddleware, simpleRolesIsAuthorized } = require("@blitzjs/server")

module.exports = {
  log: { level: "error" },
  middleware: [sessionMiddleware({ isAuthorized: simpleRolesIsAuthorized })],
}
