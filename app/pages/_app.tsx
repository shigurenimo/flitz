import { ChakraProvider } from "@chakra-ui/react"
import { init } from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
import { BoxErrorFallback } from "app/core/components/BoxErrorFallback"
import { theme } from "app/core/theme/theme"
import i18n from "app/core/utils/i18n"
import { AppProps, BlitzPage, useQueryErrorResetBoundary } from "blitz"
import {
  getAnalytics,
  isSupported,
  setAnalyticsCollectionEnabled,
} from "firebase/analytics"
import { getApps, initializeApp } from "firebase/app"
import React, { useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { I18nextProvider } from "react-i18next"

const App: BlitzPage<AppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const { reset } = useQueryErrorResetBoundary()

  useEffect(() => {
    if (0 < getApps().length) return

    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    })

    isSupported().then((bool) => {
      if (!bool) return

      if (process.env.NODE_ENV === "production") {
        setAnalyticsCollectionEnabled(getAnalytics(), true)
      }

      if (process.env.NODE_ENV !== "production") {
        setAnalyticsCollectionEnabled(getAnalytics(), false)
      }
    })
  }, [])

  useEffect(() => {
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
      tracesSampleRate: 1.0,
      debug: false,
    })
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary FallbackComponent={BoxErrorFallback} onReset={reset}>
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
      </ChakraProvider>
    </I18nextProvider>
  )
}

export default App
