const TRACED_SHARE = 0.05

export const SENTRY_OPTIONS = {
  dsn: "https://4d7bf1b629ffa153fe49d1db9a247aec@o4511342454308864.ingest.us.sentry.io/4512114846531584",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: TRACED_SHARE,
  sendDefaultPii: false,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
  },
}
