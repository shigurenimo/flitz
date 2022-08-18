import { AppProps, BlitzPage, ErrorBoundary } from "@blitzjs/next"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { ChakraProvider } from "@chakra-ui/react"
import { init } from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
import { getAnalytics, setAnalyticsCollectionEnabled } from "firebase/analytics"
import { getApps, initializeApp } from "firebase/app"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { I18nextProvider, initReactI18next } from "react-i18next"
import { QueryClient, QueryClientProvider } from "react-query"
import translationJa from "../integrations/ja.i18n.json"
import { withBlitz } from "app/blitz-client"
import { BoxErrorFallback } from "app/core/components/BoxErrorFallback"
import { theme } from "app/core/theme/theme"

const queryClient = new QueryClient()

const App: BlitzPage<AppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const { reset } = useQueryErrorResetBoundary()

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ChakraProvider theme={theme}>
          <ErrorBoundary FallbackComponent={BoxErrorFallback} onReset={reset}>
            {getLayout(<Component {...pageProps} />)}
          </ErrorBoundary>
        </ChakraProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: false,
    keySeparator: false,
    nsSeparator: false,
    resources: { ja: { translation: translationJa } },
  })

if (typeof window !== "undefined") {
  init({
    integrations: [new Integrations.BrowserTracing()],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
    normalizeDepth: 5,
    tracesSampleRate: 1.0,
    debug: false,
    beforeSend(event) {
      if (process.env.NEXT_PUBLIC_USE_SENTRY !== "true") {
        return null
      }
      return event
    },
  })
}

if (getApps().length === 0) {
  initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  })

  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    setAnalyticsCollectionEnabled(getAnalytics(), false)
  }
}

export default withBlitz(App)
