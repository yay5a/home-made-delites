# Home Made Delites - AI Coding Assistant Guide

This document guides AI assistants on key aspects of the Home Made Delites recipe sharing platform, built with Next.js, MongoDB, and GraphQL.

## Architecture Overview

-   **Next.js App Router Structure**: Uses the `/src/app` directory structure with route-based pages (e.g., `/login`, `/recipes/[id]`).
-   **MongoDB Integration**: Mongoose models for User, Recipe, Comment, and ApiUsage with connection caching.
-   **GraphQL API**: GraphQL queries and mutations through Apollo Client. Check `/src/graphql` for schema, queries, and mutations.
-   **Authentication**: JWT-based auth using `AuthContext` with token storage in localStorage and MongoDB persistence.

## Key Components and Data Flow

1. **Auth Flow**:

    - `AuthContext` (`/src/context/AuthContext.js`) provides authentication state and methods.
    - JWT tokens stored in localStorage with token-based API authentication.
    - Auth required for adding/editing recipes and profile access.
    - `authService.js` handles user registration, login, and token management with MongoDB.

2. **Recipe Data Flow**:

    - Recipe data fetched from both MongoDB and Edamam API with smart caching.
    - Component hierarchy: `RecipeList` → `RecipeCard` → Recipe Detail Page.
    - `recipeDbUtils.js` provides CRUD operations and search functionality.
    - API usage tracking and rate limiting through `ApiUsage` model.

3. **Database Models**:
    - `User`: Authentication, profile info, and recipe relationships.
    - `Recipe`: Comprehensive recipe data with text search indexes.
    - `Comment`: Recipe comments with user attribution and nested replies.
    - `ApiUsage`: Tracks API usage statistics with time-based rate limiting.
4. **UI Components**:
    - Common components in `/src/components/common` (Button, Input, Modal)
    - Layout components in `/src/components/layout` (Header, Footer, Nav)
    - Recipe components in `/src/components/recipe` (RecipeCard, RecipeList)
    - API usage components in `/components/common` (ApiQuotaStatus, ApiUsageProgressBar)

## Development Workflow

### Setup and Local Development

1. Install dependencies: `npm install`
2. Set required environment variables in `.env.local`:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:4000
    NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
    JWT_SECRET=your-super-secret-jwt-key-here
    MONGODB_URI=mongodb://localhost:27017/home-made-delites
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
    - MongoDB queries used for REST API endpoints in `/src/app/api/` directory
    - Edamam API integration with MongoDB caching in `edamamUtils.js`

## Common Patterns and Examples

## BEFORE ADDING NEW CODE, PLEASE REVIEW THE FOLLOWING GUIDELINES:

-   REVIEW THE EXISTING CODEBASE FOR REDUNDANCY AND SIMILAR FUNCTIONALITY AND
    AVOID DUPLICATION.
-   REMOVE UNNECESSARY CODE AND FILES.
-   KEEP DRY (Don't Repeat Yourself) PRINCIPLES IN MIND.
-   REASON ABOUT WHETHER THE NEW CODE IS NECESSARY AND IF IT CAN BE SIMPLIFIED WITHOUT ADDING COMPLEXITY.
-   THIS PROJECT IS A PROOF OF CONCEPT; SIMPLICITY AND EFFICIENCY ARE KEY.

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

5. **API Usage Tracking and Rate Limiting**:

    ```javascript
    // In edamamUtils.js
    try {
    	await trackApiUsage('hit'); // Tracks and enforces API rate limits
    	const response = await fetch(url, options);
    	// Process response...
    } catch (error) {
    	// Handle rate limit exceeded error
    	if (error.message.includes('Rate limit exceeded')) {
    		console.warn('API rate limit reached:', error.message);
    		// Fallback to cached data or show user-friendly message
    	}
    }
    ```

6. **MongoDB Recipe Search Example**:

    ```javascript
    // In recipeDbUtils.js
    export async function searchRecipes(criteria = {}, page = 1, limit = 10) {
    	await dbConnect();
    	const query = {};

    	// Build text search if query provided
    	if (criteria.query) {
    		query.$text = { $search: criteria.query };
    	}

    	// Add filters for cuisineType, mealType, etc.
    	if (criteria.cuisineType) query.cuisineType = criteria.cuisineType;

    	// Execute query with pagination
    	const recipes = await Recipe.find(query)
    		.sort(criteria.query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    		.skip((page - 1) * limit)
    		.limit(limit);

    	return {
    		recipes,
    		pagination: {
    			/* pagination details */
    		},
    	};
    }
    ```
