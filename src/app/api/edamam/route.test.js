import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GET, rateLimitStore, WINDOW_SIZE, MAX_REQUESTS } from './route.js';

vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ hits: [] }) }))
);

process.env.API_ID = 'id';
process.env.API_KEY = 'key';
process.env.API_URL = 'https://example.com';

function buildRequest(ip, headers = new Headers()) {
    return {
        ip,
        headers,
        nextUrl: { searchParams: new URLSearchParams([['search', 'test']]) }
    };
}

describe('rate limiter', () => {
    beforeEach(() => {
        rateLimitStore.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('resets after ttl window', async () => {
        const req = buildRequest('1.1.1.1');
        for (let i = 0; i < MAX_REQUESTS; i++) {
            const res = await GET(req);
            expect(res.status).toBe(200);
        }
        const blocked = await GET(req);
        expect(blocked.status).toBe(429);

        vi.advanceTimersByTime(WINDOW_SIZE);
        const allowed = await GET(req);
        expect(allowed.status).toBe(200);
    });

    it('cannot be bypassed with spoofed headers', async () => {
        const makeReq = () => buildRequest('2.2.2.2');
        for (let i = 0; i < MAX_REQUESTS; i++) {
            const res = await GET(makeReq());
            expect(res.status).toBe(200);
        }
        expect((await GET(makeReq())).status).toBe(429);

        const spoofed = makeReq();
        spoofed.headers.set('x-forwarded-for', '3.3.3.3');
        const stillBlocked = await GET(spoofed);
        expect(stillBlocked.status).toBe(429);
    });
});
