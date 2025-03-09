'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import JSZip from 'jszip';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@headlessui/react';

import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/constants';

type ConversionStatus = 'pending' | 'converting' | 'success' | 'error';

interface FileConversionResult {
    fileName: string;
    progress: number;
    status: ConversionStatus;
    result?: Blob;
    error?: string;
}

const outputFormats = ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

const ImagesPage: React.FC = () => {
    const [errors, setErrors] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<string>('jpg');
    const [conversionResults, setConversionResults] = useState<FileConversionResult[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
            const newErrors: string[] = [];

            fileRejections.forEach(({ file, errors: fileErrors }) => {
                fileErrors.forEach(err => {
                    newErrors.push(`File ${file.name}: ${err.message}`);
                });
            });

            const validFiles = acceptedFiles.filter(file => {
                if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    newErrors.push(`File ${file.name} is too large.`);
                    return false;
                }
                return true;
            });

            if (validFiles.length + files.length > MAX_FILES) {
                newErrors.push(`You can only upload up to ${MAX_FILES} images.`);
            } else {
                setFiles(prevFiles => [...prevFiles, ...validFiles]);
            }
            setErrors(newErrors);
        },
        [files]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
            'image/bmp': [],
            'image/tiff': [],
            'image/webp': [],
            'image/heic': [],
        },
        multiple: true,
        maxFiles: MAX_FILES,
    });

    const handleRemoveFile = (index: number) =>
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));

    const handleClearFiles = () => {
        setFiles([]);
        setConversionResults([]);
        setErrors([]);
    };

    const startConversion = () => {
        const initialResults: FileConversionResult[] = files.map(file => ({
            fileName: file.name,
            progress: 0,
            status: 'pending',
        }));
        setConversionResults(initialResults);

        files.forEach((file, index) => {
            const worker = new Worker(new URL('../../workers/imageConverter.worker.ts', import.meta.url));

            worker.onmessage = (event) => {
                const { type, progress, result, error } = event.data;
                setConversionResults(prevResults => {
                    const newResults = [...prevResults];
                    if (type === 'progress') {
                        newResults[index] = { ...newResults[index], progress, status: 'converting' };
                    } else if (type === 'complete') {
                        newResults[index] = { ...newResults[index], progress: 100, status: 'success', result };
                        worker.terminate();
                    } else if (type === 'error') {
                        newResults[index] = { ...newResults[index], status: 'error', error };
                        worker.terminate();
                    }
                    return newResults;
                });
            };

            worker.postMessage({ file, targetFormat: selectedFormat });
        });
    };

    const downloadAll = async () => {
        const zip = new JSZip();
        conversionResults.forEach((conv) => {
            if (conv.status === 'success' && conv.result) {
                const newName = conv.fileName.replace(/\.[^/.]+$/, `.${selectedFormat}`);
                zip.file(newName, conv.result);
            }
        });
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_images.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-4xl text-center mb-4">Let's play with images</h2>

            <div className="text-sm text-yellow-400 bg-yellow-900/30 p-3 rounded-lg flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                <span>
                    Each file must be <strong>less than 5MB</strong>. Maximum <strong>{MAX_FILES} images</strong> allowed.
                </span>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="format-select" className="text-white">
                    Convert to:
                </label>
                <select
                    id="format-select"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="p-2 rounded"
                >
                    {outputFormats.map((format) => (
                        <option key={format} value={format}>
                            {format.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            <div
                {...getRootProps()}
                className="sm:w-96 w-52 p-6 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer transition hover:border-gray-200"
                aria-label="File upload dropzone"
            >
                <input {...getInputProps()} />
                <button className="cursor-pointer duration-200 hover:scale-125 active:scale-100" title="Attach">
                    <svg
                        className="stroke-[#ff6900] fill-none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="50px"
                        height="50px"
                        viewBox="0 -0.5 25 25"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5"
                        ></path>
                    </svg>
                </button>
                {isDragActive ? (
                    <p className="text-gray-300">Drop the files here ...</p>
                ) : (
                    <p className="text-gray-300">Drag & drop images here, or click to select files</p>
                )}
            </div>


            {errors.length > 0 && (
                <div className="mt-2 space-y-1">
                    {errors.map((err, index) => (
                        <p key={index} className="text-red-500 text-sm text-center">
                            {err}
                        </p>
                    ))}
                </div>
            )}

            {/* Display Uploaded Files */}
            <div className="mt-4">
                {files.length > 0 && (
                    <ul className="text-white text-sm">
                        {files.map((file, index) => (
                            <li key={index} className="flex mt-1 items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                <p>
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                                <button onClick={() => handleRemoveFile(index)} aria-label="Remove file">
                                    <XMarkIcon className="w-5 h-5 text-red-500 ml-2 cursor-pointer" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Display Conversion Progress */}
            {conversionResults.length > 0 && (
                <div className="mt-4 w-full max-w-md">
                    <ul className="space-y-2">
                        {conversionResults.map((conv, index) => (
                            <li key={index} className="bg-gray-800 p-2 rounded flex flex-col">
                                <div className="flex justify-between items-center">
                                    <span>{conv.fileName}</span>
                                    {conv.status === 'error' && <span className="text-red-500">{conv.error}</span>}
                                </div>
                                <div className="w-full bg-gray-700 rounded h-2 mt-1">
                                    <div
                                        className="bg-green-500 h-2 rounded"
                                        style={{ width: `${conv.progress}%` }}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex gap-4 mt-4">
                <Button
                    onClick={startConversion}
                    className="bg-orange-500 hover:bg-orange-700 px-4 py-3 rounded-sm cursor-pointer transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label="Convert files"
                    disabled={files.length === 0 || errors.length > 0 || files.length > MAX_FILES}
                >
                    Convert
                </Button>
                {conversionResults.some(conv => conv.status === 'success') && (
                    <Button
                        onClick={downloadAll}
                        className="bg-blue-500 hover:bg-blue-700 px-4 py-3 rounded-sm cursor-pointer transition duration-300 ease-in-out"
                        aria-label="Download all converted files in ZIP"
                    >
                        Download All
                    </Button>
                )}
                <Button
                    onClick={handleClearFiles}
                    className="bg-gray-500 hover:bg-gray-700 px-4 py-3 rounded-sm cursor-pointer transition duration-300 ease-in-out"
                    aria-label="Clear files"
                >
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default ImagesPage;
