import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"
import { loginPath } from "@/features/auth/routes"
import { getPublicPages } from "@/lib/pages"
import { DOWNLOAD_PATH, FEATURES_PATH, sitePagePath } from "@/lib/routes"
import { APP_STORE_URL, PLAY_STORE_URL } from "./store-links"
import { Wordmark } from "./wordmark"

type FooterLink = { href: string; label: string; external?: boolean }

const FALLBACK_PAGES = [
  { slug: "terms", title: "Terms of Use" },
  { slug: "privacy", title: "Privacy Policy" },
]

const PRODUCT: FooterLink[] = [
  { href: FEATURES_PATH, label: "Features" },
  { href: DOWNLOAD_PATH, label: "Download" },
  { href: loginPath(), label: "Log in" },
]

const STORES: FooterLink[] = [
  { href: APP_STORE_URL, label: "App Store", external: true },
  { href: PLAY_STORE_URL, label: "Google Play", external: true },
]

export async function SiteFooter() {
  const pages = await getPublicPages()
  const legal = (pages.length > 0 ? pages : FALLBACK_PAGES).map((page) => ({
    href: sitePagePath(page.slug),
    label: page.title,
  }))

  return (
    <footer className="mt-16 border-t border-border">
      <div className="@container mx-auto w-full max-w-6xl px-6 pt-12">
        <div className="flex flex-col gap-12 @2xl:flex-row @2xl:justify-between">
          <div className="flex max-w-xs flex-col gap-4">
            <Wordmark height={24} />
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">
              What&apos;s happening on campus? Find out on Snacc.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 @lg:grid-cols-3 @2xl:gap-16">
            <FooterColumn title="Product" links={PRODUCT} />
            <FooterColumn title="Get the app" links={STORES} />
            <FooterColumn title="Legal" links={legal} />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none mt-14 h-[10cqw] overflow-hidden select-none"
        >
          <img
            src="/1.png"
            alt=""
            className="w-full opacity-[0.07] dark:hidden"
          />
          <img
            src="/2.png"
            alt=""
            className="hidden w-full opacity-[0.09] dark:block"
          />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Snacc</span>
          <span>Made for campuses across Nigeria</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>{title}</Eyebrow>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
