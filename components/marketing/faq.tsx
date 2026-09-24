"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Eyebrow } from "@/components/ui/eyebrow"

const QUESTIONS = [
  {
    q: "Who can use Snacc?",
    a: "Students and recent graduates at Nigerian universities. You pick your campus when you sign up, and if you've graduated you can say so and keep it.",
  },
  {
    q: "Is it free?",
    a: "Yes. Snacc is free to use, and sending money to another person on Snacc costs nothing.",
  },
  {
    q: "Do I need a password?",
    a: "No. Enter your email and we send you a 6-digit code. Nothing to remember.",
  },
  {
    q: "Are anonymous messages really anonymous?",
    a: "The person you message sees a ghost, not your name, until you choose to reveal yourself. Anyone can turn anonymous messages off in their privacy settings, and blocking and reporting still work.",
  },
  {
    q: "Is my money safe?",
    a: "Your balance is held with Paystack, the payment provider behind most of Nigeria's online payments, and you can move it to your bank account whenever you want.",
  },
  {
    q: "Who sees what I post?",
    a: "Your campus feed and the global feed, where students from every campus scroll. If you'd rather keep it close, make your account private and only people you approve can follow you.",
  },
  {
    q: "Can I use it on my laptop?",
    a: "Yes. Everything works on the web at snacc.fyi, and the app is on iOS and Android.",
  },
]

export function Faq() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-3 px-2 lg:sticky lg:top-8 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl font-black tracking-tight text-balance sm:text-5xl">
            Questions, answered.
          </h2>
        </div>

        <Accordion className="rounded-[2rem]">
          {QUESTIONS.map(({ q, a }) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="p-5 text-base font-bold sm:p-6 sm:text-lg">
                {q}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-5 text-base leading-relaxed text-muted-foreground sm:px-2 sm:pb-6">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
