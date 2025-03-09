'use client';

import { useEffect } from 'react';
import anime from 'animejs';

const MorphicBackground = () => {
    useEffect(() => {
        anime({
            targets: '.float-circle',
            translateY: [-15, 15], // Soft floating motion
            duration: 4000,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true,
            delay: anime.stagger(500),
        });
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-black -z-10">
            {/* Bottom Left Circles */}
            <div className="absolute bottom-0 left-0">
                {/* Solid Circle */}
                <div className="float-circle absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500 opacity-80 rounded-full" />

                {/* Glassmorphic Circle - FIXED */}
                <div className="float-circle absolute bottom-5 left-5 w-64 h-64 rounded-full 
            bg-[rgba(255,255,255,0.1)] backdrop-blur-lg border border-white/15 mix-blend-overlay" />
            </div>

            {/* Top Right Circles */}
            <div className="absolute top-0 right-0">
                {/* Solid Circle */}
                <div className="float-circle absolute -top-12 -right-12 w-72 h-72 bg-orange-500 opacity-20 rounded-full" />

                {/* Glassmorphic Circle - FIXED */}
                <div className="float-circle absolute top-16 right-20 w-56 h-56 rounded-full 
            bg-[rgba(255,255,255,0.1)] backdrop-blur-xl border border-white/20 mix-blend-overlay" />
            </div>
        </div>
    );
};

export default MorphicBackground;