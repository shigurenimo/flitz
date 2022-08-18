import { BlitzPage, ErrorComponent } from "@blitzjs/next"
import Head from "next/head"

const Page404: BlitzPage = () => {
  const statusCode = 404

  const title = "This page could not be found"

  return (
    <>
      <Head>
        <title>
          {statusCode}: {title}
        </title>
      </Head>
      <ErrorComponent statusCode={statusCode} title={title} />
    </>
  )
}

export default Page404
