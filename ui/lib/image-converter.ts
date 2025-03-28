'use client';

import { MagickFormat } from '@imagemagick/magick-wasm';
import WorkerLoader from 'worker-loader!../workers/imageWorker.worker.ts';

class ImageConverter {
    private worker: Worker = null as unknown as Worker;

    constructor() {
        if (typeof window !== 'undefined') {
            this.worker = new WorkerLoader();
        }
    }

    convert(file: File, outputFormat: MagickFormat, quality = 80): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const messageId = `${Date.now()}-${Math.random()}`;

            const listener = (e: MessageEvent) => {
                if (e.data.id !== messageId) return;

                this.worker.removeEventListener('message', handleMessage);

                if (e.data.error) {
                    reject(new Error(e.data.error));
                } else {
                    resolve(e.data.result);
                }
            };

            const handleMessage = listener.bind(this);

            this.worker.addEventListener('message', handleMessage);

            file.arrayBuffer()
                .then(buffer => {
                    this.worker.postMessage({ id: messageId, buffer, outputFormat, quality });
                })
                .catch(err => {
                    this.worker.removeEventListener('message', handleMessage);
                    reject(err);
                });
        });
    }

    terminate() {
        this.worker.terminate();
    }
}

export default ImageConverter;