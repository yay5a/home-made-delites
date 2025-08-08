const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRequestLog = new Map();

export function checkRateLimit(ip) {
    const now = Date.now();
    const requests = ipRequestLog.get(ip) || [];
    const recent = requests.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    ipRequestLog.set(ip, recent);
    return recent.length <= RATE_LIMIT_MAX_REQUESTS;
}

export function resetRateLimit() {
    ipRequestLog.clear();
}
