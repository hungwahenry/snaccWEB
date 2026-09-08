export function Mark({ height = 16 }: { height?: number }) {
  return (
    <>
      <img
        src="/1.png"
        alt="Snacc"
        style={{ height }}
        className="w-auto dark:hidden"
      />
      <img
        src="/2.png"
        alt="Snacc"
        style={{ height }}
        className="hidden w-auto dark:block"
      />
    </>
  )
}
