import Link from "next/link"
import { getPublicPages } from "@/lib/pages"

const FALLBACK = [
  { slug: "terms", title: "Terms of Use" },
  { slug: "privacy", title: "Privacy Policy" },
]

export async function SiteFooter() {
  const pages = await getPublicPages()
  const links = pages.length > 0 ? pages : FALLBACK

  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span>© {new Date().getFullYear()} Snacc</span>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {page.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
