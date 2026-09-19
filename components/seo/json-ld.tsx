import { serializeJsonLd, type JsonLd as Data } from "@/lib/json-ld"

export function JsonLd({ data }: { data: Data | null }) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
