'use client';

import WorkerLoader from 'worker-loader!./lib/workerPool.ts';

// WorkerPool.ts
export class WorkerPool {
    private pool: Worker[] = [];
    private queue: Array<{
        taskId: string;
        data: any;
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
        onProgress?: (progress: number) => void;
    }> = [];
    private activeTasks = 0;
    private poolSize: number;

    constructor(private WorkerLoader: { new(): Worker }, poolSize: number = navigator.hardwareConcurrency || 4) {
        this.poolSize = poolSize;
        for (let i = 0; i < poolSize; i++) {
            this.pool.push(new this.WorkerLoader());
        }
    }

    runTask<T>(data: any, onProgress?: (progress: number) => void): Promise<T> {
        return new Promise((resolve, reject) => {
            const taskId = `${Date.now()}-${Math.random()}`;
            this.queue.push({ taskId, data, resolve, reject, onProgress });
            this.runNext();
        });
    }

    private runNext() {
        if (this.queue.length === 0 || this.activeTasks >= this.poolSize) return;

        const worker = this.pool[this.activeTasks];
        const task = this.queue.shift();
        if (!task) return;

        const handleMessage = (e: MessageEvent) => {
            // Check if the message is for this task
            if (e.data.id !== task.taskId) return;

            // If there's a progress update, call the callback
            if (typeof e.data.progress === 'number' && task.onProgress) {
                task.onProgress(e.data.progress);
            }

            // When result is ready, resolve and clean up
            if (e.data.result) {
                worker.removeEventListener('message', handleMessage);
                this.activeTasks--;
                task.resolve(e.data.result);
                this.runNext();
            }

            // If an error occurred, reject and clean up
            if (e.data.error) {
                worker.removeEventListener('message', handleMessage);
                this.activeTasks--;
                task.reject(e.data.error);
                this.runNext();
            }
        };

        worker.addEventListener('message', handleMessage);
        worker.postMessage({ id: task.taskId, payload: task.data });
        this.activeTasks++;
    }

    terminate() {
        this.pool.forEach(worker => worker.terminate());
    }
}
