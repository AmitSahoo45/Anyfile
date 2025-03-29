'use client';

import { MagickFormat } from '@imagemagick/magick-wasm';
import WorkerLoader from 'worker-loader!../../workers/imageWorker.worker.ts';
import { WorkerPool } from '../workerPool';

class ImageConverter {
    private worker: Worker = null as unknown as Worker;
    private workerPool: WorkerPool = null as unknown as WorkerPool;

    constructor() {
        if (typeof window !== 'undefined') {
            // Initialize a pool of workers (e.g., 4 workers by default)
            this.workerPool = new WorkerPool(WorkerLoader, 4);
        }
    }

    async convert(
        file: File,
        outputFormat: MagickFormat,
        quality = 80,
        onProgress?: (progress: number) => void
    ): Promise<Blob> {
        const buffer = await file.arrayBuffer();
        // Pass the onProgress callback into runTask
        return await this.workerPool.runTask<Blob>(
            { buffer, outputFormat, quality },
            onProgress
        );
    }

    terminate() {
        this.workerPool.terminate();
    }
}

export default ImageConverter;