import { Eyebrow } from "@/components/ui/eyebrow"

export function WhySnacc() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="landing-frame flex flex-col items-center gap-6 rounded-[2.5rem] px-6 py-16 text-center sm:px-10 lg:py-24">
        <Eyebrow>Why Snacc exists</Eyebrow>
        <h2 className="max-w-3xl text-4xl font-black tracking-tighter text-balance uppercase sm:text-6xl">
          Your campus deserved its own app.
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          Campus life was scattered across group chats and timelines built for
          the whole world. Snacc is built for one place: your university. The
          gist, the clips, the plans, the money you owe your roommate, with the
          people who are actually there.
        </p>
      </div>
    </section>
  )
}
