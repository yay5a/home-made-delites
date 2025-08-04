# Cursor-Based Pagination Implementation

This document describes the cursor-based pagination system implemented in the Home Made Delites application, which replaces the inefficient offset/limit pagination approach.

## Problem Statement

The previous implementation used a `skip/limit` approach for pagination, which becomes increasingly inefficient as the dataset grows because:

1. The database still needs to scan through all skipped documents
2. Performance degrades linearly with offset size
3. For large offsets, the database must read and discard thousands of documents

## Cursor-Based Pagination Solution

### Overview

Cursor-based pagination uses a "pointer" (cursor) to the last item in the current page to efficiently fetch the next set of results, without requiring the database to scan through all preceding documents.

Key benefits:

-   **Constant Performance**: Query time remains constant regardless of page depth
-   **Consistency**: Handles concurrent updates without duplicating or missing items
-   **Scalability**: Performs well with large datasets
-   **Stability**: Maintains consistency even when items are added or removed

### Implementation Details

#### 1. Cursor Design

Cursors are implemented as base64-encoded JSON objects containing:

-   The document ID (`_id`)
-   The sort field value (e.g., `createdAt` timestamp or `score`)

Example:

```javascript
const cursor = Buffer.from(
	JSON.stringify({
		id: '507f1f77bcf86cd799439011',
		value: '2023-04-01T12:34:56.789Z',
	})
).toString('base64');
```

#### 2. Query Structure

For forward pagination:

```javascript
// If sorting by createdAt desc
query.$or = [
	{ createdAt: { $lt: cursorDate } }, // Get items with earlier dates
	{ createdAt: cursorDate, _id: { $gt: cursorId } }, // Or with same date but higher IDs
];
```

For backward pagination:

```javascript
query.$or = [
	{ createdAt: { $gt: cursorDate } }, // Get items with later dates
	{ createdAt: cursorDate, _id: { $lt: cursorId } }, // Or with same date but lower IDs
];
```

#### 3. Detecting More Pages

To determine if there are more pages:

-   Request `limit + 1` items
-   If we get more than `limit`, there are more pages
-   Remove the extra item before returning the result

#### 4. GraphQL Integration

The GraphQL API was updated to:

-   Accept cursor parameters instead of offset
-   Return both `nextCursor` and `prevCursor` for bidirectional pagination
-   Include `hasMore` flag to indicate if more results exist

#### 5. UI Integration

The UI components now:

-   Store and pass cursor values between page requests
-   Handle bidirectional navigation with next/previous cursors
-   Provide improved user experience with consistent page sizes

## Technical Implementation

### Database Layer

-   `searchRecipes()` in `recipeDb.server.js` implements cursor-based filtering
-   `getUserRecipes()` uses the same pattern for user-specific recipe lists
-   Both functions encode/decode cursors and handle bidirectional pagination

### GraphQL Layer

-   Schema updated to support cursors and pagination metadata
-   Resolvers modified to use cursor-based database functions
-   Return type changed from arrays to pagination objects with metadata

### Client/React Hooks

-   `useRecipes` hook updated to store and manage cursors
-   Added bidirectional navigation with `loadMoreDbRecipes` and `loadPreviousDbRecipes`
-   GraphQL queries updated to match new schema

## Performance Considerations

-   Indexes should be created for all fields used in cursor-based queries
-   Compound indexes may be needed for efficient sorting and filtering
-   Consider encoding/decoding overhead for cursor strings

## Future Improvements

-   Implement relay-style cursor connections for full GraphQL Cursor Connections spec compliance
-   Add cursor-based pagination for other list endpoints
-   Optimize cursor encoding/decoding for reduced overhead
-   Implement cursor encryption if cursor contents should be opaque to clients
