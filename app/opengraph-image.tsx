import { ImageResponse } from "next/og"

export const alt = "Snacc — the social app for your campus"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BG = "#000000"
const FG = "#ffffff"
const MUTED = "#8b8b8b"
const RESNACC = "#24c187" // brand green — resnacc (dark variant, reads on black)

async function loadInterTight(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`,
  ).then((res) => res.text())
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)
  if (!src) throw new Error(`Inter Tight ${weight} not found`)
  return fetch(src[1]).then((res) => res.arrayBuffer())
}

export default async function OpengraphImage() {
  let fonts: { name: string; data: ArrayBuffer; weight: 500 | 800; style: "normal" }[] = []
  try {
    const [extraBold, medium] = await Promise.all([loadInterTight(800), loadInterTight(500)])
    fonts = [
      { name: "Inter Tight", data: extraBold, weight: 800, style: "normal" },
      { name: "Inter Tight", data: medium, weight: 500, style: "normal" },
    ]
  } catch {
    // Fall back to the built-in font if Google Fonts is unreachable at render time.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 80,
          fontFamily: "Inter Tight, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, color: MUTED, letterSpacing: 1 }}>
          snacc<span style={{ color: RESNACC }}>.</span>fyi
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 184,
              fontWeight: 800,
              color: FG,
              letterSpacing: -9,
              lineHeight: 1,
            }}
          >
            snacc<span style={{ color: RESNACC }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 500, color: MUTED, marginTop: 20 }}>
            What&apos;s happening on campus?
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          <span style={{ display: "flex" }}>The social app for your campus</span>
          <span style={{ display: "flex", color: RESNACC }}>·</span>
          <span style={{ display: "flex" }}>iOS &amp; Android</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
