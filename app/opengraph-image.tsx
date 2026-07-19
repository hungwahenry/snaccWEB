import { ImageResponse } from "next/og"

export const alt = "Snacc — What's happening on campus"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: -5,
          }}
        >
          snacc<span style={{ color: "#10b981" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 46, color: "#a1a1a1", marginTop: 12 }}>
          What&apos;s happening on campus?
        </div>
      </div>
    ),
    { ...size },
  )
}
