import { ImageMagick, MagickFormat, MagickGeometry, initializeImageMagick } from '@imagemagick/magick-wasm'

let initialized = false

async function load() {
    if (!initialized) {
        const response = await fetch('/magick.wasm');
        await initializeImageMagick(await response.arrayBuffer());
        initialized = true;
    }
}

export async function extractGIFFrames(file: File, maxFrameSize = 150) {
    if (!initialized)
        await load()

    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)

    return new Promise(resolve => {
        const blobs: Blob[] = []

        ImageMagick.readCollection(data, frames => {
            frames.coalesce() 

            frames.forEach(async frame => {
                const geometry = new MagickGeometry(maxFrameSize)

                geometry.greater = true

                frame.resize(geometry)

                const blob: Blob = await new Promise(resolve => {
                    frame.write(MagickFormat.Jpeg, data => {
                        const blob = new Blob([data], { type: 'image/jpeg' })
                        resolve(blob)
                    })
                })

                blobs.push(blob)
            })

            resolve(blobs)
        })
    })
}

export async function convertImages(file: File, format: MagickFormat) {
    if (!initialized)
        await load()

    const buffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)

    return new Promise(resolve => {
        ImageMagick.read(data, image => {
            image.format = format

            image.write(data => {
                const blob = new Blob([data], { type: `image/${format}` })
                resolve(blob)
            })
        })
    })
}