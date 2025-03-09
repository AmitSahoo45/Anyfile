'use client'

import React, { useState } from 'react'
import Image from "next/image";
import SplashScreen from './SplashScreen';

const LandingContent: React.FC = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        showSplash ?
            (<SplashScreen onAnimationComplete={() => setShowSplash(false)} />)
            :
            (<div className='flex items-center'>

                {/* Image container */}
                <div>
                    <Image
                        src="/images/logo.png"
                        alt="Anyfile"
                        width={200}
                        height={50}
                    />
                </div>
                {/* Image container */}
            </div>
            )
    )
}

export default LandingContent