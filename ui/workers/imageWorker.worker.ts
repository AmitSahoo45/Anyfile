/// <reference lib="webworker" />

import { initializeImageMagick, ImageMagick } from '@imagemagick/magick-wasm';

let initialized = false;

self.onmessage = async (event) => {
    const { id, buffer, outputFormat, quality } = event.data;

    try {
        if (!initialized) {
            const response = await fetch('/magick.wasm');
            await initializeImageMagick(await response.arrayBuffer());
            initialized = true;
        }

        const data = new Uint8Array(buffer);
        ImageMagick.read(data, (image) => {

            if (quality) image.quality = quality;

            image.write((data) => {
                const blob = new Blob([data], { type: `image/${outputFormat}` });
                self.postMessage({ id, result: blob });
            });
        });
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({ error: 'Conversion Error' });
    }
};
