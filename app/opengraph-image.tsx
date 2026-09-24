import { readFile } from "node:fs/promises"
import { ImageResponse } from "next/og"
import type { ReactNode } from "react"

export const runtime = "nodejs"
export const alt = "Snacc — What's happening on campus?"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const INK = "#000000"
const MUTED = "#4a4a4a"
const FEATURES = ["Posts", "Clips", "Anonymous messages", "Money"]

async function loadInterTight(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`
  ).then((res) => res.text())
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)
  if (!src) throw new Error(`Inter Tight ${weight} not found`)
  return fetch(src[1]).then((res) => res.arrayBuffer())
}

export default async function OpengraphImage() {
  const [clouds, wordmark] = await Promise.all([
    readFile(new URL("../public/hero-clouds.jpg", import.meta.url)),
    readFile(new URL("../public/1.png", import.meta.url)),
  ])
  const cloudsSrc = `data:image/jpeg;base64,${clouds.toString("base64")}`
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`

  let fonts: {
    name: string
    data: ArrayBuffer
    weight: 500 | 900
    style: "normal"
  }[] = []
  try {
    const [black, medium] = await Promise.all([
      loadInterTight(900),
      loadInterTight(500),
    ])
    fonts = [
      { name: "Inter Tight", data: black, weight: 900, style: "normal" },
      { name: "Inter Tight", data: medium, weight: 500, style: "normal" },
    ]
  } catch {}

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 56,
        overflow: "hidden",
        fontFamily: "Inter Tight, sans-serif",
      }}
    >
      <img
        src={cloudsSrc}
        alt=""
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundColor: "rgba(255,255,255,0.3)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage:
            "linear-gradient(160deg, rgba(169,201,240,0.15) 0%, rgba(232,200,240,0.5) 50%, rgba(255,211,192,0.7) 100%)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img src={wordmarkSrc} alt="" width={205} height={40} />
        <Pill>snacc.fyi</Pill>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: -5,
            lineHeight: 0.95,
            color: INK,
          }}
        >
          <span>WHAT&apos;S HAPPENING</span>
          <span>ON CAMPUS?</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          The coolest social app for university students.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {FEATURES.map((feature) => (
            <Pill key={feature}>{feature}</Pill>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          Free on iOS &amp; Android
        </div>
      </div>
    </div>,
    { ...size, fonts }
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px 20px",
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(0,0,0,0.08)",
        fontSize: 24,
        fontWeight: 500,
        color: INK,
      }}
    >
      {children}
    </div>
  )
}
