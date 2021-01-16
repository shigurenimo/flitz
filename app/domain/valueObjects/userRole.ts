import * as z from "zod"

export const userRoleSchema = z.union([
  z.literal("ADMIN"),
  z.literal("SYSTEM"),
  z.literal("USER"),
])

export type UserRoleValue = z.infer<typeof userRoleSchema>

export class UserRole {
  constructor(public value: UserRoleValue) {
    userRoleSchema.parse(value)
    Object.freeze(this)
  }
}
