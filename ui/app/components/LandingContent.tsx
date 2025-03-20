'use client';

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import SplashScreen from './SplashScreen';

const LandingContent: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        showSplash ? (
            <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
        ) : (
            <main className='flex flex-col items-center justify-center gap-6 text-center p-4'>
                <div>
                    <Image
                        src="/images/logo.png"
                        alt="Anyfile - Free Online File Converter"
                        width={200}
                        height={50}
                        priority
                    />
                </div>

                <h1 className='text-3xl md:text-5xl font-bold'>
                    Free Online Image Converter
                </h1>

                <p className='text-gray-300 max-w-xl'>
                    Instantly convert images between <strong>JPG, PNG, GIF, BMP, TIFF, WEBP, HEIC</strong> formats.
                    Completely secure, private, and browser-based.
                </p>

                <Link
                    href="/image-converter"
                    className='mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition'
                >
                    Convert Images Now →
                </Link>

                <p className='text-sm text-gray-400 mt-8'>
                    🚀 More exciting features coming soon! Stay tunned!!!! 
                </p>
            </main>
        )
    );
};

export default LandingContent;
