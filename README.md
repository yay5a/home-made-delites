# Home Made Delites

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js Version](https://img.shields.io/badge/next.js-15.4.5-blueviolet)
![React Version](https://img.shields.io/badge/react-19.1.0-blue)

A modern recipe sharing web application built with Next.js and GraphQL where food enthusiasts can discover, share, and save their favorite homemade recipes.

## 🚀 Features

-   **User Authentication**: Secure login and account management
-   **Recipe Discovery**: Browse and search for recipes by category, ingredients, or popularity
-   **Personal Profiles**: User dashboards with saved recipes and cooking history
-   **Responsive Design**: Optimized for desktop and mobile devices
-   **GraphQL API**: Efficient data fetching and mutations

## 📋 Prerequisites

-   Node.js 18.x or higher
-   npm 9.x or higher

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/home-made-delites.git
cd home-made-delites
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
# Create a .env.local file in the root directory with the following variables
NEXT_PUBLIC_API_URL=your_api_url
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

1. Run the development server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧰 Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Frontend**: React, Tailwind CSS
-   **API**: GraphQL with Apollo Server
-   **Authentication**: JWT with bcrypt
-   **Database**: MongoDB with Mongoose
-   **Styling**: Tailwind CSS

## 🔄 Available Scripts

-   `npm run dev` - Run the development server
-   `npm run build` - Build the application for production
-   `npm start` - Start the production server
-   `npm run lint` - Run ESLint to check code quality

## 🧪 Testing

Testing framework and guidelines will be added in future updates.

## 📝 API Documentation

The GraphQL API provides the following main operations:

### Queries

-   `getRecipes`: Fetch all recipes with optional filtering
-   `getRecipeById`: Get detailed information about a specific recipe
-   `getUserProfile`: Get user profile information

### Mutations

-   `createUser`: Register a new user
-   `loginUser`: Authenticate a user
-   `createRecipe`: Add a new recipe
-   `updateRecipe`: Modify an existing recipe
-   `deleteRecipe`: Remove a recipe

## 🤝 Contributing

1. Fork the repository
1. Create your feature branch (`git checkout -b feature/amazing-feature`)
1. Commit your changes (`git commit -m 'Add some amazing feature'`)
1. Push to the branch (`git push origin feature/amazing-feature`)
1. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

-   Next.js team for the awesome framework
-   The open-source community for inspiration and tools

---

Built with ❤️ by the Home Made Delites Team
