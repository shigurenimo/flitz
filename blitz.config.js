const {
  sessionMiddleware,
  simpleRolesIsAuthorized,
} = require("@blitzjs/server")
const withPWA = require("next-pwa")

module.exports = withPWA({
  log: { level: "error" },
  middleware: [sessionMiddleware({ isAuthorized: simpleRolesIsAuthorized })],
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
})
