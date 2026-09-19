import type { ComponentProps } from "react"

type LazyImageProps = Omit<ComponentProps<"img">, "alt" | "loading"> & {
  alt: string
}

export function LazyImage({ alt, ...props }: LazyImageProps) {
  return <img decoding="async" {...props} alt={alt} loading="lazy" />
}
