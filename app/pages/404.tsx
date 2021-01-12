import { BlitzPage, ErrorComponent, Head } from "blitz"

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
