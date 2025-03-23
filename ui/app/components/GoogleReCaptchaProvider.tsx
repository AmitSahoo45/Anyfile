'use client';

import React, { ReactNode } from 'react';
import { GoogleReCaptchaProvider as ReCaptchaProvider } from 'react-google-recaptcha-v3';

interface GoogleReCaptchaProviderProps {
    children: ReactNode;
}

export default function GoogleReCaptchaProvider({ children }: GoogleReCaptchaProviderProps) {
    return (
        <ReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            scriptProps={{ async: true, defer: true, appendTo: 'head' }}
        >
            {children}
        </ReCaptchaProvider>
    );
}