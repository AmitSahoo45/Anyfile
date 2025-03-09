export type ConversionStatus = 'pending' | 'converting' | 'success' | 'error';

export interface FileConversionResult {
    fileName: string;
    progress: number;
    status: ConversionStatus;
    result?: Blob;
    error?: string;
}

export const outputFormats = ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'];