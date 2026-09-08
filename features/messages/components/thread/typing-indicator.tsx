export function TypingIndicator() {
  return (
    <div
      aria-label="Typing"
      className="my-1 flex items-center gap-1 self-start rounded-2xl bg-muted px-3.5 py-3"
    >
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
    </div>
  )
}
