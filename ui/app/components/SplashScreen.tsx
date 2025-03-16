'use client';

import React, { useEffect, useState } from 'react';
import anime from 'animejs';

const greetings = ["Hello", "नमस्ते", "Bienvenido", "Bonjour", "Ciao"];

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
    const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);

    useEffect(() => {
        const timeline = anime.timeline({
            easing: 'easeInOutQuad',
        });

        greetings.forEach((greeting, index) => {
            timeline
                .add({
                    targets: '.splash-greeting',
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 300,
                    begin: () => setCurrentGreeting(greeting),
                })
                .add({
                    targets: '.splash-greeting',
                    opacity: [1, 0],
                    translateY: [0, -100],
                    duration: 100,
                    delay: 300,
                });
        });

        timeline.add({
            targets: '.splash',
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInOutQuad',
            complete: onAnimationComplete,
        });
    }, [onAnimationComplete]);

    return (
        <div className="splash fixed inset-0 z-50 flex items-center justify-center bg-black">
            <h1 className="splash-greeting text-white text-4xl font-bold opacity-0">
                {currentGreeting}
            </h1>
        </div>
    );
};

export default SplashScreen;