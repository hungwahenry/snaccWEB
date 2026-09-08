/// The Snacc mark as a static picture: black on light, white on dark. For cards that get rasterised.
export function Mark({ height = 16 }: { height?: number }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/1.png"
        alt="Snacc"
        style={{ height }}
        className="w-auto dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/2.png"
        alt="Snacc"
        style={{ height }}
        className="hidden w-auto dark:block"
      />
    </>
  )
}
