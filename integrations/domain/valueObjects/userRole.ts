import * as z from "zod"

export const zUserRole = z.union([
  z.literal("ADMIN"),
  z.literal("SYSTEM"),
  z.literal("USER"),
])

export type UserRoleValue = z.infer<typeof zUserRole>

/**
 * ユーザーの権限
 */
export class UserRole {
  constructor(public value: UserRoleValue) {
    zUserRole.parse(value)
    Object.freeze(this)
  }
}
