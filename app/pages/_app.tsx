import { ChakraProvider } from "@chakra-ui/react"
import { RootErrorFallback } from "app/core/components/RootErrorFallback"
import { useFirebase } from "app/core/hooks/useFirebase"
import i18n from "app/core/utils/i18n"
import { theme } from "app/core/utils/theme"
import { AppProps, BlitzPage, useRouter } from "blitz"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { I18nextProvider } from "react-i18next"
import { queryCache } from "react-query"

const App: BlitzPage<AppProps> = ({ Component, pageProps }) => {
  useFirebase()

  const getLayout = Component.getLayout || ((page) => page)

  const router = useRouter()

  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary
          FallbackComponent={RootErrorFallback}
          onReset={() => queryCache.resetErrorBoundaries()}
          resetKeys={[router.asPath]}
        >
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
