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

export function appendImage(
  form: FormData,
  field: string,
  image: PickedImage,
  fallbackName: string
): void {
  form.append(field, image.file, image.fileName || `${fallbackName}.jpg`)
}
