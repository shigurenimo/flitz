import { hashPassword } from "app/auth/utils/hashPassword"
import { verifyPassword } from "app/auth/utils/verifyPassword"
import { AuthenticationError } from "blitz"
import db from "db"
import SecurePassword from "secure-password"

export const authenticateUser = async (email: string, password: string) => {
  const account = await db.account.findUnique({
    where: { email: email.toLowerCase() },
    include: { user: true },
  })

  if (!account || !account.hashedPassword) {
    throw new AuthenticationError()
  }

  const result = await verifyPassword(account.hashedPassword, password)

  if (result !== SecurePassword.VALID && result !== SecurePassword.VALID_NEEDS_REHASH) {
    throw new AuthenticationError()
  }

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    const improvedHash = await hashPassword(password)

    await db.account.update({
      where: { id: account.id },
      data: { hashedPassword: improvedHash },
    })
  }

  return { ...account.user, role: account.role }
}
