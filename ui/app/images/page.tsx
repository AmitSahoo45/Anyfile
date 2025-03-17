'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ImageConverter from '@/lib/image-converter';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/constants';
import { MagickFormat } from '@imagemagick/magick-wasm';
import { FormatSelector } from '../components';
// import { convertImages, extractGIFFrames } from '@/lib/ImageMagickService';

const ImagesPage: React.FC = () => {
    const [errors, setErrors] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<MagickFormat>(MagickFormat.Jpg);
    const [conversionResults, setConversionResults] = useState<FileConversionResult[]>([]);
    const [converter] = useState(() => new ImageConverter());
    const [previews, setPreviews] = useState<string[]>([]);

    // Generate image previews when files change
    useEffect(() => {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Clean up the object URLs when unmounting
        return () => {
            newPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        const newErrors: string[] = [];

        if (fileRejections.length > 0) {
            toast.error(`${fileRejections.length} file(s) couldn't be accepted`, {
                icon: '❌',
                style: {
                    background: '#FEE2E2',
                    color: '#B91C1C',
                    border: '1px solid #F87171',
                },
            });

            fileRejections.forEach(({ file, errors: fileErrors }) => {
                fileErrors.forEach(err => {
                    newErrors.push(`File ${file.name}: ${err.message}`);
                });
            });
        }

        const validFiles = acceptedFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                newErrors.push(`File ${file.name} is too large.`);
                return false;
            }
            return true;
        });

        if (validFiles.length + files.length > MAX_FILES) {
            toast.error(`You can only upload up to ${MAX_FILES} images at once.`, {
                icon: '⚠️',
                style: {
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #F59E0B',
                },
            });
        } else if (validFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
            toast.success(`Added ${validFiles.length} image(s)`, {
                icon: '✅',
                style: {
                    background: '#D1FAE5',
                    color: '#065F46',
                    border: '1px solid #10B981',
                },
            });
        }

        const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error(`${oversizedFiles.length} file(s) exceed the ${MAX_FILE_SIZE_MB}MB limit`, {
                icon: '❌',
                style: {
                    background: '#FEE2E2',
                    color: '#B91C1C',
                    border: '1px solid #F87171',
                },
            });
        }

        setErrors(newErrors);
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
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

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleClearFiles = () => {
        // Clean up preview URLs
        previews.forEach(preview => URL.revokeObjectURL(preview));
        setPreviews([]);
        setFiles([]);
        setConversionResults([]);
        setErrors([]);
    };

    const startConversion = async () => {
        const toastId = toast.loading('Converting images...', {
            style: {
                background: '#E0F2FE',
                color: '#0369A1',
                border: '1px solid #38BDF8',
            },
        });

        setErrors([]);
        setConversionResults([]);
        const results: FileConversionResult[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const newFileName = file.name.replace(/\.[^/.]+$/, `.${selectedFormat.toLowerCase()}`);

            // Update progress for this file
            setConversionResults(prevResults => [
                ...prevResults,
                { fileName: newFileName, status: 'converting', progress: 0 }
            ]);

            try {
                // Show progress update in toast
                toast.loading(`Converting ${i + 1}/${files.length}: ${file.name}`, {
                    id: toastId,
                });

                const convertedBlob = await converter.convert(file, selectedFormat);

                results.push({
                    fileName: newFileName,
                    result: convertedBlob,
                    status: 'success',
                    progress: 100,
                });

                setConversionResults([...results]);
            } catch (error: any) {
                console.error(`Error converting ${file.name}:`, error);

                results.push({
                    fileName: newFileName,
                    error: error.message,
                    status: 'error',
                    progress: 0
                });

                setErrors(prevErrors => [...prevErrors, `Failed to convert ${file.name}: ${error.message}`]);
                setConversionResults([...results]);
            }
        }

        toast.dismiss(toastId);

        if (results.every(r => r.status === 'success')) {
            toast.success('All conversions completed successfully!', {
                icon: '🎉',
                style: {
                    background: '#D1FAE5',
                    color: '#065F46',
                    border: '1px solid #10B981',
                },
            });
        } else if (results.some(r => r.status === 'error')) {
            toast.error(`${results.filter(r => r.status === 'error').length} file(s) failed to convert`, {
                icon: '⚠️',
                style: {
                    background: '#FEE2E2',
                    color: '#B91C1C',
                    border: '1px solid #F87171',
                },
            });
        } else {
            toast.success('Conversion completed with some issues', {
                icon: '⚠️',
                style: {
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #F59E0B',
                },
            });
        }
    };

    const downloadAll = async () => {
        if (conversionResults.some(r => r.status === 'success')) {
            const toastId = toast.loading('Preparing download...', {
                style: {
                    background: '#E0F2FE',
                    color: '#0369A1',
                    border: '1px solid #38BDF8',
                },
            });

            const zip = new JSZip();

            conversionResults.forEach(result => {
                if (result.status === 'success' && result.result)
                    zip.file(result.fileName, result.result);
            });

            const content = await zip.generateAsync({ type: 'blob' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `converted_images_${selectedFormat.toLowerCase()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            toast.dismiss(toastId);
            toast.success('Download ready!', {
                icon: '📦',
                style: {
                    background: '#D1FAE5',
                    color: '#065F46',
                    border: '1px solid #10B981',
                },
            });
        }
    };


    return (
        <div className="relative min-h-screen">
            {/* Semi-transparent background circles for visual interest but less opacity */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl opacity-20 z-0"></div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <header className="mb-8 flex flex-col items-center gap-4">
                    <h1 className="text-4xl font-bold text-center mb-8">Let's play with images</h1>

                    <div className="text-sm text-yellow-400 bg-yellow-900/30 p-3 rounded-lg flex items-center gap-2">
                        {/* text-sm text-yellow-400 bg-yellow-900/30 p-3 rounded-lg flex items-center gap-2 */}
                        {/* bg-amber-900/20 border border-amber-500/50 text-amber-200 p-3 rounded-lg mb-6 flex items-center w-full gap-2 */}
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                        <span>Each file must be less than {MAX_FILE_SIZE_MB}MB. Maximum {MAX_FILES} images allowed.</span>
                    </div>
                </header>

                {/* Conversion controls - grouped together */}
                <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl mb-6 w-fit mx-auto">
                    <div className="flex flex-col items-center gap-2 text-center mb-4">
                        <label className="text-white font-medium">Convert to:</label>
                        <div className="format-selector-container">
                            <select
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value as MagickFormat)}
                                className="p-3 rounded-lg bg-white/10 border border-white/30 text-white font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option className='bg-black/45' value={MagickFormat.Jpg}>JPG - Joint Photographic Experts Group</option>
                                <option className='bg-black/45' value={MagickFormat.Png}>PNG - Portable Network Graphics</option>
                                <option className='bg-black/45' value={MagickFormat.Gif}>GIF - Graphics Interchange Format</option>
                                <option className='bg-black/45' value={MagickFormat.Bmp}>BMP - Bitmap Image File</option>
                                <option className='bg-black/45' value={MagickFormat.WebP}>WEBP - Web Picture format</option>
                                <option className='bg-black/45' value={MagickFormat.Tiff}>TIFF - Tagged Image File Format</option>
                            </select>
                        </div>
                    </div>

                    {/* Format description */}
                    <div className="text-white/70 text-sm mb-2">
                        {selectedFormat === MagickFormat.Jpg && "Best for photographs and complex images with many colors."}
                        {selectedFormat === MagickFormat.Png && "Ideal for images with transparency and sharp details."}
                        {selectedFormat === MagickFormat.Gif && "Perfect for simple animations and images with limited colors."}
                        {selectedFormat === MagickFormat.WebP && "Modern format with excellent compression and quality."}
                        {selectedFormat === MagickFormat.Bmp && "Uncompressed format that preserves exact pixel data."}
                        {selectedFormat === MagickFormat.Tiff && "High-quality format often used in professional publishing."}
                    </div>
                </div>

                {/* Dropzone with improved visuals */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer mb-6 
                ${isDragActive
                            ? 'border-orange-400 bg-orange-500/20'
                            : 'border-gray-400 hover:border-orange-400 hover:bg-orange-500/10'}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-xl font-medium text-white">
                            {isDragActive ? 'Drop the files here ...' : 'Drag & drop images here, or click to select files'}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Supports JPG, PNG, GIF, BMP, TIFF, WEBP, and HEIC formats
                        </p>
                    </div>
                </div>

                {/* Image previews and file list */}
                {files.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-4">Selected Images ({files.length})</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 group">
                                    <div className="aspect-square overflow-hidden bg-gray-900/50">
                                        <img
                                            src={previews[index]}
                                            alt={`Preview of ${file.name}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-white text-sm font-medium truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove file"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Conversion progress */}
                {conversionResults.length > 0 && (
                    <div className="mb-6 bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Conversion Progress</h2>
                        <div className="space-y-3">
                            {conversionResults.map((conv, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                                    {conv.status === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                                    {conv.status === 'error' && <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                                    {conv.status === 'converting' && (
                                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}

                                    <div className="flex-1">
                                        <p className="text-white font-medium">{conv.fileName}</p>
                                        {conv.status === 'error' && <p className="text-red-400 text-sm">{conv.error}</p>}
                                    </div>

                                    <div className="w-24">
                                        {conv.status === 'converting' ? (
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 animate-pulse"></div>
                                            </div>
                                        ) : conv.status === 'success' ? (
                                            <span className="text-green-500 text-sm">Completed</span>
                                        ) : (
                                            <span className="text-red-500 text-sm">Failed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={startConversion}
                        disabled={files.length === 0 || conversionResults.some(conv => conv.status === 'converting')}
                        className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Convert
                    </button>

                    {conversionResults.some(conv => conv.status === 'success') && (
                        <button
                            onClick={downloadAll}
                            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold transition flex items-center gap-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Download All
                        </button>
                    )}

                    <button
                        onClick={handleClearFiles}
                        className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold transition flex items-center gap-2"
                    >
                        <XMarkIcon className="h-5 w-5" />
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImagesPage;
