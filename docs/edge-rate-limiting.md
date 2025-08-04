# Edge Runtime Rate Limiting

This document explains the rate limiting strategy implemented in the Edge middleware for the Home Made Delites application.

## Overview

The application uses a lightweight in-memory rate limiting strategy that is compatible with Next.js Edge Runtime. This approach doesn't require external services like Redis or database connections, making it suitable for edge environments.

## Implementation Details

The rate limiting is implemented in `src/middleware.js` using JavaScript's native `Map` objects as in-memory stores. These stores track request counts per client IP address across different time windows.

### Time Windows

The implementation uses three time windows:

1. **Minute Window**: Limits regular API requests to prevent abuse (10 requests per minute)
2. **Day Window**: Limits assistant API calls to manage resource usage (30 calls per day)
3. **Month Window**: Enforces overall API usage quotas (10,000 requests per month)

### How It Works

1. When a request comes in, the middleware identifies if it's an API request by checking the URL path
2. For API requests, it extracts the client IP address
3. Based on the request type (regular API or assistant API), it applies the appropriate rate limits
4. If a rate limit is exceeded, it returns a 429 (Too Many Requests) response with informative headers
5. The cache entries automatically expire after their respective time windows

### Rate Limit Thresholds

The rate limits are configured in `src/config/apiLimits.js`:

-   `HITS_PER_MINUTE`: 10 (Regular API calls)
-   `HITS_PER_MONTH`: 10,000 (Total API calls)
-   `ASSISTANT_CALLS_PER_DAY`: 30 (Assistant API calls)
-   `ASSISTANT_TOKENS_PER_DAY`: 10,000 (Assistant token usage)

## Response Headers

When a rate limit is exceeded, the middleware returns a 429 response with the following headers:

-   `X-RateLimit-Limit`: The applicable rate limit ceiling
-   `X-RateLimit-Remaining`: Always 0 when rate limited
-   `Retry-After`: Suggested wait time in seconds before retrying (60 for minute limits, 86400 for day limits, 2592000 for month limits)

## Limitations

This in-memory approach has some limitations:

1. **No persistence**: Rate limit counters reset when the server restarts
2. **Multi-instance challenges**: In a multi-instance deployment, each instance maintains its own counters
3. **Memory usage**: Heavy traffic could increase memory consumption

For production-grade applications requiring more robust rate limiting, consider using external providers like:

-   Upstash Redis (compatible with Vercel Edge functions)
-   Vercel KV (for Vercel deployments)
-   Cloudflare Workers KV (for Cloudflare deployments)

## Future Improvements

Potential enhancements include:

1. Using more sophisticated token bucket algorithms
2. Adding per-user/API key rate limiting based on authentication
3. Implementing shared rate limiting across instances using external storage
4. Gradually degrading service instead of hard cut-offs
