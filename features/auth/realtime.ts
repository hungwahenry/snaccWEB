/** The server closed this session. A fresh load goes through the usual sign-in or suspended check. */
export function onSessionRevoked(): void {
  window.location.reload()
}
