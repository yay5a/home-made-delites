# MongoDB Integration for Home Made Delites

This document outlines the MongoDB integration implemented for the Home Made Delites application.

## Models

The following Mongoose models have been created:

1. **User** - `/src/models/User.js`

    - User authentication and profile information
    - Includes password hashing and validation
    - Relations to favorites and saved recipes

2. **Recipe** - `/src/models/Recipe.js`

    - Comprehensive recipe data model
    - Text search indexes for recipe searching
    - Includes relationships to users (created by, liked by, saved by)

3. **Comment** - `/src/models/Comment.js`

    - Recipe comments and discussions
    - Supports nested comments (replies)
    - User relationships for comment attribution

4. **ApiUsage** - `/src/models/ApiUsage.js`
    - Tracks API usage statistics
    - Persists usage counters for minute/day/month periods
    - Used to enforce rate limits

## Key Utilities

1. **Database Connection** - `/src/lib/mongoose.js`

    - Singleton pattern for MongoDB connection
    - Connection caching to prevent multiple connections
    - Environment-based configuration

2. **Recipe Database Utils** - `/src/lib/recipeDbUtils.js`

    - CRUD operations for recipes
    - Search functionality with filtering and pagination
    - User interactions with recipes (likes, saves)

3. **Authentication Service** - `/src/lib/authService.js`
    - User registration and login
    - JWT token generation and verification
    - Password management

## API Integration

1. **Recipe API** - `/src/app/api/recipes/route.js`

    - REST API for recipe operations
    - Search and filtering
    - Individual recipe fetching

2. **User Recipe Interactions** - `/src/app/api/user/recipes/route.js`

    - User's saved and liked recipes
    - Toggle like/save functionality

3. **API Usage Tracking** - `/src/app/api/admin/api-usage/route.js`
    - Admin dashboard data for API usage
    - Counter reset functionality

## Edamam Integration Updates

1. **Persistent API Usage Tracking** - `edamamUtils.js`

    - Replaced in-memory tracking with MongoDB persistence
    - Added async/await support for database operations

2. **Recipe Caching**
    - Added MongoDB caching for recipes
    - Fallback to in-memory cache for performance
    - Recipe transformation and validation before storage

## Environment Configuration

Added MongoDB connection string to `.env.local.example`:

```properties
MONGODB_URI=mongodb://localhost:27017/home-made-delites
```

## Usage

1. **Setup MongoDB**:

    - Install MongoDB locally or use a cloud provider (Atlas)
    - Set the `MONGODB_URI` in your `.env.local` file

2. **Initialize Database**:

    - The application will automatically create collections and indexes
    - No manual schema setup required

3. **Development Usage**:
    - The application will use both in-memory cache and MongoDB for optimal performance
    - API usage tracking is persisted across application restarts

## Data Flow

1. **Recipe Fetching**:

    - Check MongoDB cache first
    - Fallback to in-memory cache if not found
    - Call Edamam API if not in either cache
    - Save API results to MongoDB for future use

2. **API Usage Tracking**:

    - MongoDB document tracks all API usage
    - Provides persistence across application restarts
    - Automated counter resets based on timeframes

3. **User Authentication**:
    - JWT tokens for authentication
    - MongoDB stores user data and relationships
    - Password hashing for security

## Future Enhancements

1. **Replica Set Support** - For high availability
2. **Aggregation Pipelines** - For complex recipe analytics
3. **Capped Collections** - For logging and temporary data
4. **TTL Indexes** - For automatic data expiration
5. **Change Streams** - For real-time updates
