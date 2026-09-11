/** The bouncing dots of someone typing; in a room, with who it is beside them. */
export function TypingIndicator({ label }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label ?? "Typing"}
      className="my-1 flex items-center gap-2 self-start"
    >
      <span className="flex items-center gap-1 rounded-2xl bg-muted px-3.5 py-3">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce"
            style={{
              animationDelay: `${index * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </span>
      {label ? (
        <span className="text-xs text-muted-foreground italic">{label}</span>
      ) : null}
    </div>
  )
}
