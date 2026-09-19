export const clipsPath = (snaccId: string, revealed = false) =>
  `/clips/${encodeURIComponent(snaccId)}${revealed ? "?revealed=1" : ""}`
