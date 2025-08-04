# Token Estimation for AI Assistants

This document describes the token estimation approach used in the Home Made Delites recipe assistant.

## Overview

Accurate token estimation is critical for:

1. Proper quota management
2. Preventing unexpected overages
3. Ensuring fair usage of the assistant feature

## Previous Implementation

The original implementation used a very simple approximation:

-   ~4 characters per token
-   This led to inaccurate usage tracking
-   Quotas were potentially inflated or depleted incorrectly

## Improved Implementation

The new token counter (`src/utils/tokenCounter.js`) uses a more sophisticated heuristic approach:

### Token Counting Algorithm

1. **Word-Based Foundation**: Most common English words are approximately 1 token
2. **Length Adjustments**: Very long words (>12 chars) are counted as multiple tokens
3. **Special Character Handling**: Punctuation and special characters often split into separate tokens
4. **Number Sequence Detection**: Long number sequences are counted appropriately
5. **Unicode Support**: Non-ASCII characters use more tokens on average
6. **Whitespace Accounting**: Newlines and whitespace patterns are counted

### API Integration

When actual token counts are available from the AI service API:

1. The system will use the precise counts provided by the API
2. Initial conservative estimates are used for quota checking
3. Actual usage is reconciled after the API response

## Usage

```javascript
// Basic token estimation
import { countTokens } from '@/utils/tokenCounter';
const tokens = countTokens('Your text here');

// Extract tokens from API responses
import { getTokenCountsFromResponse } from '@/utils/tokenCounter';
const { promptTokens, completionTokens } = getTokenCountsFromResponse(apiResponse);
```

## Benefits

1. **More Accurate Quota Management**: Users get a more precise understanding of their remaining quota
2. **Better Resource Planning**: System administrators can better predict and plan for API usage
3. **Improved User Experience**: Less chance of unexpected quota depletion
4. **Dynamic Response Estimation**: Response token estimation now varies based on prompt length and complexity

## Future Improvements

For even more accurate token counting, consider:

1. Implementing a full GPT tokenizer (requires more runtime resources)
2. Using machine learning to predict token counts based on text characteristics
3. Dynamically adjusting estimation parameters based on observed token usage patterns
