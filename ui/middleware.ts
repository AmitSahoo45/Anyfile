import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

export async function middleware(request: NextRequest) {
    let sessionId: string = request.cookies.get('crsn')?.value || '';
    const response: NextResponse = NextResponse.next();

    if (!sessionId) {
        sessionId = nanoid();
        response.cookies.set('crsn', sessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }

    const redis = new Redis({
        url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
        token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || ''
    });

    const rateLimitKey = `ratelimit:${sessionId}`;
    const now = Date.now();
    const windowSizeMs = 60_000; // Time window of 1 minute

    const MAX_REQUESTS = 30;

    const pipeline = redis.pipeline();
    pipeline.zadd(rateLimitKey, { score: now, member: `${now}` });
    pipeline.zremrangebyscore(rateLimitKey, 0, now - windowSizeMs);
    pipeline.zcard(rateLimitKey);
    pipeline.expire(rateLimitKey, 60);

    try {
        const [/*zaddResult*/, /*zremResult*/, requestCount] = await pipeline.exec();

        if ((requestCount as number) > MAX_REQUESTS) {
            return new NextResponse(
                "Whoa there, partner! You've been clicking like a caffeinated squirrel. Give it 60 seconds before trying again!",
                {
                    status: 429,
                    headers: {
                        'Retry-After': '60'
                    }
                });
        }
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
