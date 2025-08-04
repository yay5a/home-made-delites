# Home Made Delites - AI Coding Assistant Guide

This document guides AI assistants on key aspects of the Home Made Delites recipe sharing platform, built with Next.js and GraphQL.

## Architecture Overview

-   **Next.js App Router Structure**: Uses the `/src/app` directory structure with route-based pages (e.g., `/login`, `/recipes/[id]`).
-   **GraphQL API**: GraphQL queries and mutations through Apollo Client. Check `/src/graphql` for schema, queries, and mutations.
-   **Authentication**: JWT-based auth using `AuthContext` with token storage in localStorage.

## Key Components and Data Flow

1. **Auth Flow**:

    - `AuthContext` (`/src/context/AuthContext.js`) provides authentication state and methods.
    - JWT tokens stored in localStorage with token-based API authentication.
    - Auth required for adding/editing recipes and profile access.

2. **Recipe Data Flow**:

    - Recipe data fetched via GraphQL queries in `useRecipes` hook.
    - Component hierarchy: `RecipeList` → `RecipeCard` → Recipe Detail Page.
    - Currently uses mock data in development (see `useRecipes.js`).

3. **UI Components**:
    - Common components in `/src/components/common` (Button, Input, Modal)
    - Layout components in `/src/components/layout` (Header, Footer, Nav)
    - Recipe components in `/src/components/recipe` (RecipeCard, RecipeList)

## Development Workflow

### Setup and Local Development

1. Install dependencies: `npm install`
2. Set required environment variables in `.env.local`:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:4000
    NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
    JWT_SECRET=your-super-secret-jwt-key-here
    ```
3. Run the development server: `npm run dev`
4. Access at [http://localhost:3000](http://localhost:3000)

### Project Conventions

1. **File Structure**:

    - Route-specific components are in `/src/app/{route}/page.js`
    - Shared components in `/src/components/{category}/{Component}.js`
    - Hooks in `/src/hooks/use{Feature}.js`

2. **Styling**:

    - Uses Tailwind CSS for styling
    - Utility classes preferred over custom CSS

3. **Data Fetching**:
    - Use Apollo Client hooks (useQuery, useMutation) for GraphQL operations
    - GraphQL fragments are used for consistent type definitions
    - API errors handled through custom ApiError class in `/src/lib/api.js`

## Common Patterns and Examples

1. **Adding a New Page/Route**:

    - Create new directory in `/src/app/{route}`
    - Add `page.js` for the route component

2. **Creating GraphQL Operations**:

    - Add queries to `/src/graphql/queries.js`
    - Add mutations to `/src/graphql/mutations.js`
    - Use fragments from `/src/graphql/fragments.js` for consistency

3. **Authentication Check Example**:

    ```jsx
    'use client';
    import { useAuth } from '@/hooks/useAuth';
    import { redirect } from 'next/navigation';

    export default function ProtectedPage() {
    	const { isAuthenticated, isLoading } = useAuth();

    	if (!isLoading && !isAuthenticated) {
    		redirect('/login');
    	}

    	// Protected content here
    }
    ```

4. **Recipe Component Integration Example**:

    ```jsx
    import { RecipeList } from '@/components/recipe/RecipeList';
    import { useRecipes } from '@/hooks/useRecipes';

    export default function RecipesPage() {
    	const { recipes, isLoading } = useRecipes();
    	return <RecipeList recipes={recipes} isLoading={isLoading} />;
    }
    ```
