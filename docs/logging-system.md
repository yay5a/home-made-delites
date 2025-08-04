# Centralized Logging System

This document provides information about the centralized logging system used in Home Made Delites.

## Overview

The logging system provides consistent logging across the application with environment-based verbosity control. It's designed to reduce noise in production environments while providing detailed logs in development.

## Log Levels

-   **ERROR**: Always logged in all environments. Used for critical issues that need immediate attention.
-   **WARN**: Logged by default in all environments. Used for potential issues or unexpected conditions.
-   **INFO**: Logged only in development by default. Used for important application events.
-   **DEBUG**: Logged only in development by default. Used for detailed debugging information.

## Usage

```javascript
import logger from '@/utils/logger';

// Log an error with an error object
logger.error('Failed to connect to database', error);

// Log a warning with additional data
logger.warn('API rate limit approaching', { remaining: 10, limit: 100 });

// Log informational messages
logger.info('Recipe successfully saved', recipeId);

// Log debug information
logger.debug('Cache hit for recipe', recipeId);
```

## Configuration

The log level can be controlled via the `LOG_LEVEL` environment variable:

-   `0` = ERROR only
-   `1` = ERROR + WARN (default in production)
-   `2` = ERROR + WARN + INFO
-   `3` = ERROR + WARN + INFO + DEBUG (default in development)

## Production vs Development

-   In production, only ERROR and WARN logs are shown by default.
-   In development, all log levels are shown by default.

## Benefits

-   Consistent log format across the application
-   Environment-aware log levels reduce noise in production
-   Easy to enable/disable different log levels
-   Simplified debugging and troubleshooting
