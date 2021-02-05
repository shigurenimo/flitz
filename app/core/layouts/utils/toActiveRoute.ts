export const toActiveRoute = (pathname: string) => {
  if (pathname === "/") {
    return "home"
  }

  if (pathname.startsWith("/about")) {
    return "about"
  }

  if (pathname.startsWith("/exchanges")) {
    return "exchanges"
  }

  if (pathname.startsWith("/notifications")) {
    return "notifications"
  }

  if (pathname.startsWith("/posts")) {
    return "posts"
  }

  if (pathname.startsWith("/settings")) {
    return "settings"
  }

  return "users"
}
