/// <reference lib="webworker" />

import { initializeImageMagick, ImageMagick, MagickFormat } from '@imagemagick/magick-wasm';

let initialized = false;
const formatMapping: Record<string, MagickFormat> = {
    jpg: MagickFormat.Jpeg,
    jpeg: MagickFormat.Jpeg,
    png: MagickFormat.Png,
    gif: MagickFormat.Gif,
    bmp: MagickFormat.Bmp,
    tiff: MagickFormat.Tiff,
    webp: MagickFormat.WebP,
};

self.onmessage = async (event) => {
    const { id, buffer, outputFormat, quality } = event.data;

    try {
        if (!initialized) {
            const response = await fetch('/magick.wasm');
            await initializeImageMagick(await response.arrayBuffer());
            initialized = true;
        }

        console.log(buffer);

        ImageMagick.read(new Uint8Array(buffer), (image) => {
            image.format = formatMapping[outputFormat.toLowerCase()];
            image.quality = quality || 80;
            image.strip(); 

            console.log('testing - ', image);

            image.write((result) => {
                const transferableBuffer = result.buffer.slice(0); 
                self.postMessage({ id, result: transferableBuffer }, [transferableBuffer]);
            });
        });
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({ error: 'Conversion Error' });
    }
};
