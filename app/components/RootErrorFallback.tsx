import {
  AuthenticationError,
  AuthorizationError,
  CSRFTokenMismatchError,
  ErrorComponent,
  NotFoundError,
} from "blitz"
import React, { FunctionComponent } from "react"
import { FallbackProps } from "react-error-boundary"

export const RootErrorFallback: FunctionComponent<FallbackProps> = ({
  error,
}) => {
  if (error instanceof AuthenticationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title={"Sorry, you are not authorized to access this"}
      />
    )
  }

  if (error instanceof CSRFTokenMismatchError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title={"CSRF token mismatch"}
      />
    )
  }

  if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title={"Sorry, you are not authorized to access this"}
      />
    )
  }

  if (error instanceof NotFoundError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title={"The requested URL was not found on this server"}
      />
    )
  }

  return (
    <ErrorComponent
      statusCode={500}
      title={"Sorry, we had an unexpected error. Please try again."}
    />
  )
}
