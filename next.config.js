const { withBlitz } = require("@blitzjs/next")
const packageJSON = require("./package.json")

module.exports = withBlitz({
  blitz: {},
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: `flitz@${packageJSON.version}`,
  },
})
