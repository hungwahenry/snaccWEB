import { StoreButtons } from "./store-buttons"

export function AppCTA({ title }: { title: string }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-background/0 to-background" />
      <div className="relative flex flex-col items-center gap-4 bg-background px-6 pb-10 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-balance">
          {title}
        </h2>
        <p className="max-w-xs text-pretty text-muted-foreground">
          Get the app to react, reply, and see everything happening on your
          campus.
        </p>
        <StoreButtons />
      </div>
    </div>
  )
}
