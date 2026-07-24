import type { ReactNode } from "react"
import { APP_STORE_URL, PLAY_STORE_URL } from "./store-links"

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function PlayLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.005 1.005 0 0 1-.61-.924V2.738c0-.377.223-.706.609-.924zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626c.71.411.71 1.442 0 1.853l-2.808 1.626-2.499-2.5 2.5-2.605zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  )
}

function StoreButton({
  href,
  logo,
  top,
  bottom,
}: {
  href: string
  logo: ReactNode
  top: string
  bottom: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="bg-foreground text-background flex items-center gap-3 rounded-2xl px-5 py-3 transition-transform hover:scale-[1.02]"
    >
      {logo}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] tracking-wide uppercase opacity-80">{top}</span>
        <span className="text-base font-semibold">{bottom}</span>
      </span>
    </a>
  )
}

export function StoreButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <StoreButton href={APP_STORE_URL} top="Download on the" bottom="App Store" logo={<AppleLogo />} />
      <StoreButton href={PLAY_STORE_URL} top="Get it on" bottom="Google Play" logo={<PlayLogo />} />
    </div>
  )
}
