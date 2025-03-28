'use client';

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useState } from 'react';

export const useReCaptcha = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const verifyReCaptcha = async (action: string = 'image_conversion'): Promise<boolean> => {
        if (!executeRecaptcha) {
            console.error('reCAPTCHA has not been loaded');
            return false;
        }

        setIsVerifying(true);

        try {
            // Execute reCAPTCHA with the action
            const token = await executeRecaptcha(action);

            // Verify the token on your backend
            const response = await fetch('/api/verify-recaptcha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success && data.score > 0.5) {
                setIsVerified(true);
                return true;
            } else {
                console.warn('reCAPTCHA verification failed or score too low', data);
                setIsVerified(false);
                return false;
            }
        } catch (error) {
            console.error('Error verifying reCAPTCHA:', error);
            setIsVerified(false);
            return false;
        } finally {
            setIsVerifying(false);
        }
    };

    return { verifyReCaptcha, isVerifying, isVerified };
};