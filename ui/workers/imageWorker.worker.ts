/// <reference lib="webworker" />

import { initializeImageMagick, ImageMagick } from '@imagemagick/magick-wasm';

let initialized = false;

async function loadWasm() {
    if (!initialized) {
        const response = await fetch('/magick.wasm');
        await initializeImageMagick(await response.arrayBuffer());
        initialized = true;
    }
}

self.onmessage = async (e: MessageEvent) => {
    const { id, payload } = e.data;
    const { buffer, outputFormat, quality } = payload;

    try {
        if (!initialized) await loadWasm();

        self.postMessage({ id, progress: 50 });

        const data = new Uint8Array(buffer);
        ImageMagick.read(data, (image) => {

            if (quality) image.quality = quality;

            image.write((data) => {
                const blob = new Blob([data], { type: `image/${outputFormat}` });
                self.postMessage({ id, progress: 100, result: blob });
            });
        });
    } catch (error) {
        self.postMessage({ id, error: 'Conversion Error' });
    }
};
