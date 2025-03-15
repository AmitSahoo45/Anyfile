declare module '*.wasm' {
    const value: string;
    export default value;
}

type ConversionFormat =
    | 'Jpeg' | 'Png' | 'WebP' | 'Gif'
    | 'Tiff' | 'Bmp' | 'Heic';

interface ConversionResult {
    success: boolean;
    result?: ArrayBuffer;
    error?: string;
}

type ConversionStatus = 'pending' | 'converting' | 'success' | 'error';

interface FileConversionResult {
    fileName: string;
    progress: number;
    status: ConversionStatus;
    result?: Blob;
    error?: string;
}