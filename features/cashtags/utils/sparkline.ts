export interface SparklinePaths {
  line: string
  area: string
}

export function sparklinePaths(
  values: number[],
  width: number,
  height: number,
  pad = 2
): SparklinePaths | null {
  if (values.length < 2 || width <= 0 || height <= 0) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const points = values.map((value, index) => ({
    x: index * stepX,
    y: pad + (1 - (value - min) / span) * (height - pad * 2),
  }))

  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    )
    .join(" ")
  const area = `${line} L${width} ${height} L0 ${height} Z`

  return { line, area }
}
