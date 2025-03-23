import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'reCAPTCHA token is missing' },
                { status: 400 }
            );
        }

        // Verify the token with Google
        const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const recaptchaData = await recaptchaResponse.json();

        // Return the verification result
        if (recaptchaData.success) {
            return NextResponse.json({
                success: true,
                score: recaptchaData.score,
                action: recaptchaData.action,
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'reCAPTCHA verification failed', errors: recaptchaData['error-codes'] },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return NextResponse.json(
            { success: false, message: 'Server error during verification' },
            { status: 500 }
        );
    }
}