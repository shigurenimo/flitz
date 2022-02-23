import { EnvAdapter } from "integrations/infrastructure"
import { container } from "tsyringe"

describe("EnvAdapter", () => {
  it("sentry", () => {
    const envAdapter = container.resolve(EnvAdapter)

    expect(envAdapter.sentry.dsn).not.toBeUndefined()

    expect(envAdapter.sentry.environment).not.toBeUndefined()
  })

  it("useSentry", () => {
    const envAdapter = container.resolve(EnvAdapter)

    expect(envAdapter.useSentry).not.toBeUndefined()
  })

  it("useFirebaseEmulator", () => {
    const envAdapter = container.resolve(EnvAdapter)

    expect(envAdapter.useFirebaseEmulator).not.toBeUndefined()
  })
})
