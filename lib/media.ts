import { sameOriginMedia } from "./media-url"

export interface PickedImage {
  file: Blob
  uri: string
  width: number
  height: number
  mimeType: string
  fileName: string
}

const SNACC_MAX_EDGE = 2048
const AVATAR_MAX_EDGE = 512
const JPEG_QUALITY = 0.8

function chooseFiles(multiple: boolean): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = multiple
    input.style.display = "none"

    const finish = (files: File[]) => {
      input.remove()
      resolve(files)
    }

    input.addEventListener("change", () =>
      finish(Array.from(input.files ?? []))
    )
    input.addEventListener("cancel", () => finish([]))
    document.body.appendChild(input)
    input.click()
  })
}

function load(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read that image."))
    }
    image.src = url
  })
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode image.")),
      type,
      JPEG_QUALITY
    )
  })
}

async function downscale(file: File, maxEdge: number): Promise<PickedImage> {
  const image = await load(file)
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))
  const keepOriginal = scale === 1 && file.type !== "image/heic"

  if (keepOriginal) {
    return {
      file,
      uri: URL.createObjectURL(file),
      width: image.width,
      height: image.height,
      mimeType: file.type || "image/jpeg",
      fileName: file.name,
    }
  }

  const canvas = document.createElement("canvas")
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)

  const type = file.type === "image/png" ? "image/png" : "image/jpeg"
  const blob = await toBlob(canvas, type)

  return {
    file: blob,
    uri: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    mimeType: type,
    fileName: file.name.replace(
      /\.\w+$/,
      type === "image/png" ? ".png" : ".jpg"
    ),
  }
}

export async function pickImage(): Promise<PickedImage | null> {
  const [file] = await chooseFiles(false)
  return file ? downscale(file, AVATAR_MAX_EDGE) : null
}

export async function pickImages(limit: number): Promise<PickedImage[]> {
  const files = await chooseFiles(limit > 1)
  return Promise.all(
    files.slice(0, limit).map((file) => downscale(file, SNACC_MAX_EDGE))
  )
}

function loadFromUrl(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read that picture."))
    image.src = sameOriginMedia(uri)
  })
}

function fromCanvas(
  canvas: HTMLCanvasElement,
  type: string,
  fileName: string
): Promise<PickedImage> {
  return toBlob(canvas, type).then((blob) => ({
    file: blob,
    uri: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    mimeType: type,
    fileName,
  }))
}

export interface CropRect {
  originX: number
  originY: number
  width: number
  height: number
}

export function fromBlob(
  blob: Blob,
  size: { width: number; height: number },
  fileName: string
): PickedImage {
  return {
    file: blob,
    uri: URL.createObjectURL(blob),
    width: size.width,
    height: size.height,
    mimeType: blob.type || "image/jpeg",
    fileName,
  }
}

export async function fromUrl(
  uri: string,
  fileName = "image.jpg"
): Promise<PickedImage> {
  const image = await loadFromUrl(uri)
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  canvas.getContext("2d")?.drawImage(image, 0, 0)
  return fromCanvas(canvas, "image/jpeg", fileName)
}

export async function cropImage(
  asset: PickedImage,
  rect: CropRect
): Promise<PickedImage> {
  const image = await loadFromUrl(asset.uri)
  const scale = Math.min(1, SNACC_MAX_EDGE / Math.max(rect.width, rect.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(rect.width * scale))
  canvas.height = Math.max(1, Math.round(rect.height * scale))
  canvas
    .getContext("2d")
    ?.drawImage(
      image,
      rect.originX,
      rect.originY,
      rect.width,
      rect.height,
      0,
      0,
      canvas.width,
      canvas.height
    )
  return fromCanvas(canvas, "image/jpeg", asset.fileName || "image.jpg")
}

export async function rotateImage(
  asset: PickedImage,
  degrees: number
): Promise<PickedImage> {
  const image = await loadFromUrl(asset.uri)
  const quarter =
    ((degrees % 360) + 360) % 360 === 90 ||
    ((degrees % 360) + 360) % 360 === 270
  const canvas = document.createElement("canvas")
  canvas.width = quarter ? image.naturalHeight : image.naturalWidth
  canvas.height = quarter ? image.naturalWidth : image.naturalHeight
  const context = canvas.getContext("2d")
  if (context) {
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((degrees * Math.PI) / 180)
    context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
  }
  return fromCanvas(canvas, "image/jpeg", asset.fileName || "image.jpg")
}

export function appendImage(
  form: FormData,
  field: string,
  image: PickedImage,
  fallbackName: string
): void {
  form.append(field, image.file, image.fileName || `${fallbackName}.jpg`)
}
