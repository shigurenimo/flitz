import SecurePassword from "secure-password"

const SP = () => new SecurePassword()

export const verifyPassword = async (hashedPassword: string, password: string) => {
  try {
    return await SP().verify(Buffer.from(password), Buffer.from(hashedPassword, "base64"))
  } catch (error) {
    console.error(error)
    return false
  }
}
