import { StoreButtons } from "./store-buttons"

export function AppCTA({ title }: { title: string }) {
  return (
    <div className="relative">
      <div className="from-background/0 to-background pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b" />
      <div className="bg-background relative flex flex-col items-center gap-4 px-6 pb-10 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-balance">{title}</h2>
        <p className="text-muted-foreground max-w-xs text-pretty">
          Get the app to react, reply, and see everything happening on your campus.
        </p>
        <StoreButtons />
      </div>
    </div>
  )
}
