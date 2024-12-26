import type { AlertDialogRef } from "app/components"

export const handleApiError = (
  ref: React.RefObject<AlertDialogRef>,
  response: { kind: string },
  logout: () => void,
  mainAction: (() => Promise<void>) | (() => void),
) => {
  const isSessionError = response.kind === "forbidden" || response.kind === "unauthorized"
  ref.current?.set({
    title: isSessionError ? "common.sessionExpired" : undefined,
    message: isSessionError ? "common.sessionExpiredMsg" : "common.errorUnexpected",
    redirectLabel: isSessionError ? "common.proceed" : "common.tryAgain",
    onRedirect: isSessionError ? logout : mainAction,
  })
  ref.current?.show()
}
