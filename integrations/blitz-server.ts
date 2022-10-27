import "reflect-metadata"

import { AuthServerPlugin, PrismaStorage } from "@blitzjs/auth"
import { simpleRolesIsAuthorized } from "@blitzjs/auth"
import { setupBlitzServer } from "@blitzjs/next"
import { BlitzLogger } from "blitz"
import { authConfig } from "./blitz-client"
import db from "db"

export const { gSSP, gSP, api } = setupBlitzServer({
  logger: BlitzLogger({}),
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
})
