import { NextRequest, NextResponse } from 'next/server';

// In-memory store for request counts
const requestStore = new Map<string, { count: number; resetTime: number }>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export async function GET(request: NextRequest) {
    // Get IP from various headers or fallback to unknown
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const now = Date.now();

    // Get or create record for this IP
    let record = requestStore.get(ip);

    // If record exists and window hasn't expired
    if (record) {
        if (now < record.resetTime) {
            // Window is still valid
            if (record.count >= MAX_REQUESTS) {
                // Rate limit exceeded
                return NextResponse.json(
                    {
                        error: 'Rate limit exceeded',
                        retryAfter: Math.ceil((record.resetTime - now) / 1000)
                    },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
                        }
                    }
                );
            }
            // Increment counter
            record.count++;
        } else {
            // Window expired, reset record
            record = {
                count: 1,
                resetTime: now + WINDOW_SIZE_MS
            };
        }
    } else {
        // Create new record
        record = {
            count: 1,
            resetTime: now + WINDOW_SIZE_MS
        };
    }

    // Update store
    requestStore.set(ip, record);

    // Return success response with rate limit info
    return NextResponse.json(
        {
            message: 'Hello! This is a rate-limited API.',
            requestNumber: record.count,
            remainingRequests: MAX_REQUESTS - record.count,
            resetTime: new Date(record.resetTime).toISOString()
        },
        {
            headers: {
                'X-RateLimit-Limit': MAX_REQUESTS.toString(),
                'X-RateLimit-Remaining': (MAX_REQUESTS - record.count).toString(),
                'X-RateLimit-Reset': (record.resetTime / 1000).toString()
            }
        }
    );
}
