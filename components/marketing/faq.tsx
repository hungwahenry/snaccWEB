"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Eyebrow } from "@/components/ui/eyebrow"

export interface FaqQuestion {
  q: string
  a: string
}

export function Faq({ questions }: { questions: FaqQuestion[] }) {
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
          {questions.map(({ q, a }) => (
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
