import { ChakraProvider } from "@chakra-ui/react"
import { RootErrorFallback } from "app/core/components/RootErrorFallback"
import i18n from "app/core/utils/i18n"
import { theme } from "app/core/utils/theme"
import { AppProps, BlitzPage, useQueryErrorResetBoundary } from "blitz"
import { getApps, initializeApp } from "firebase/app"
import React, { useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { I18nextProvider } from "react-i18next"

const App: BlitzPage<AppProps> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)

  const { reset } = useQueryErrorResetBoundary()

  useEffect(() => {
    if (typeof window === "undefined") return

    if (!process.env.NEXT_PUBLIC_API_KEY) return

    if (0 < getApps().length) return

    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    })
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary FallbackComponent={RootErrorFallback} onReset={reset}>
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
        <style jsx global>{`
          #__next {
            max-width: 80rem;
            margin: 0 auto;
          }
        `}</style>
      </ChakraProvider>
    </I18nextProvider>
  )
}

export default App
