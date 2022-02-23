export const useFirestoreId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  let text = ""

  for (let i = 0; i < 20; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return [text] as const
}
