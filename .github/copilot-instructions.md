# Home Made Delites - AI Coding Assistant Guide

This document guides AI assistants on key aspects of the Home Made Delites recipe sharing platform, built with Next.js, MongoDB, and GraphQL.

## Recipe App Architecture Outline

### 1. Data Layer (MongoDB)

-   **Collections & Schemas**

    -   **Users**: store credentials, profile info, and an array of saved recipe IDs.
    -   **Recipes**: store title, description, ingredients, image URL, embedded comments, and list of user IDs who’ve liked it.

-   **Embed vs. Reference**

    -   **Embed** comments inside recipe documents for fast reads.
    -   **Reference** users in likes and saves to avoid duplicating profile data at scale.

-   **Indexing**

    -   Create indexes on `title` and `ingredients` fields to accelerate searches.

### 2. GraphQL Schema & Apollo Server

-   **Type Definitions**

    -   Define `User`, `Recipe`, `Comment` types, as well as auth and pagination payload types.
    -   Queries: `searchRecipes`, `recipe`, `me`.
    -   Mutations: `register`, `login`, `saveRecipe`, `likeRecipe`, `commentRecipe`.

-   **Resolvers**

    -   Map queries and mutations to corresponding Mongoose operations.
    -   Verify JWT from the `Authorization` header and inject user into context.

-   **Security**

    -   Apply auth checks at the resolver level or via schema directives.
    -   Configure CORS and JSON parsing middleware.

### 3. Server Architecture & Best Practices

-   **Hosting**

    -   Host Apollo Server behind Express or integrate into Next.js API routes.

-   **Performance Monitoring**

    -   Enable Apollo Server metrics and use MongoDB profiler to identify slow queries.

-   **Incremental Adoption**

    -   Start with a core schema, then progressively add features like pagination and advanced auth.

### 4. Client-Side (Apollo Client + React)

-   **Setup**

    -   Create an `ApolloClient` with an HTTP link to `/api/graphql` and an auth link reading the JWT from storage.
    -   Wrap the React app in `<ApolloProvider>`.

-   **Caching & Normalization**

    -   Use `InMemoryCache` to normalize entities, enabling cache updates after likes/comments without full refetch.

-   **Hooks & Patterns**

    -   `useQuery` for data fetching, `useLazyQuery` for search-as-you-type.
    -   `useMutation` for save/like/comment flows, with optimistic UI updates and `refetchQueries` or `cache.modify`.

### 5. Feature Flows (Conceptual)

1. **Onboard**: call `register`/`login` → receive JWT + user payload → store token (HTTP-only cookie preferred).
2. **Browse & Search**: run `recipes` or `searchRecipes` queries → render recipe cards.
3. **Save & Like**: trigger `saveRecipe`/`likeRecipe` → update arrays and reflect via cache.
4. **Comment**: call `commentRecipe` → optimistic UI insert, handle rollback on error.

### 6. Deployment & Next Steps

-   **Env & Secrets**: configure `MONGODB_URI` and `JWT_SECRET` as environment variables; enable HTTPS.
-   **Indexes & Sharding**: revisit data modeling if traffic grows; consider sharding high-volume collections.
-   **Scale**: add cursor-based pagination, rate-limit operations, or explore GraphQL federation for service splitting.

---

## Development Workflow

### Project Conventions

1. **File Structure**:

    - Route-specific components are in `/src/app/{route}/page.js`
    - Shared components in `/src/components/{category}/{Component}.js`
    - Hooks in `/src/hooks/use{Feature}.js`

2. **Styling**:

    - Uses Tailwind CSS for styling
    - Utility classes preferred over custom CSS

3. **Data Fetching**:
    - Apollo Client hooks (useQuery, useMutation) for GraphQL operations
    - APOLLO SERVER FOR GRAPHQL QUERIES AND MUTATIONS
    - GraphQL fragments for consistent type definitions
    - MongoDB queries used for STORING/FETCHING USER DATA AND RECIPES CONNECTED TO USERS E.G. RECIPES ADDED BY USER, COMMENTS MADE BY USER, ETC.
    - Edamam API integration with GRAPHQL queries for recipe data

## Common Patterns and Examples

## BEFORE ADDING NEW CODE, PLEASE REVIEW THE FOLLOWING GUIDELINES:

-   Scan the codebase and remove all the bloat and anything that's unnecessarily cluttering the code base. Implement refinements only if it increases the efficiency of the algorithms. Account and iterate on analysis, creating a chain of thought process behind
    your actions.
-   REMOVE UNNECESSARY CODE AND FILES.
-   KEEP DRY (Don't Repeat Yourself) PRINCIPLES IN MIND.
-   REASON ABOUT WHETHER THE NEW CODE IS NECESSARY AND IF IT CAN BE SIMPLIFIED WITHOUT ADDING COMPLEXITY.
-   THIS PROJECT IS A PROOF OF CONCEPT; SIMPLICITY AND EFFICIENCY ARE KEY.
-   AVOID OVER-ENGINEERING AND UNNECESSARY COMPLEXITY.
-
