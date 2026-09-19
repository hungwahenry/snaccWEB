const HOSTS = (process.env.NEXT_PUBLIC_MEDIA_HOSTS ?? "media.snacc.fyi")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean)

export function isProxyableMedia(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" && HOSTS.includes(parsed.hostname)
  } catch {
    return false
  }
}

export function sameOriginMedia(url: string): string {
  if (!isProxyableMedia(url)) return url
  return `/api/media?url=${encodeURIComponent(url)}`
}

const SERVABLE = /^(image|video|audio)\//i

export function isServableMedia(contentType: string): boolean {
  const type = contentType.split(";")[0].trim()
  return SERVABLE.test(type) && !/svg/i.test(type)
}
