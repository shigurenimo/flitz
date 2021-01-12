import SecurePassword from "secure-password"

const SP = () => new SecurePassword()

export const hashPassword = async (password: string) => {
  const hashedBuffer = await SP().hash(Buffer.from(password))

  return hashedBuffer.toString("base64")
}
