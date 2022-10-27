const { withBlitz } = require("@blitzjs/next")
const packageJSON = require("./package.json")

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: `flitz@${packageJSON.version}`,
  },
}

module.exports = withBlitz(nextConfig)
