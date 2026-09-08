export interface Size {
  width: number
  height: number
}

export function aspectRatio(size: Size): number {
  return size.width > 0 && size.height > 0 ? size.width / size.height : 1
}
