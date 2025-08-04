// Email validation
export const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
	// At least 8 characters, one uppercase, one lowercase, one number
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
};

// Recipe validation
export const validateRecipe = (recipe) => {
	const errors = {};

	if (!recipe.title || recipe.title.trim().length < 3) {
		errors.title = 'Title must be at least 3 characters long';
	}

	if (!recipe.description || recipe.description.trim().length < 10) {
		errors.description = 'Description must be at least 10 characters long';
	}

	if (!recipe.ingredients || recipe.ingredients.length === 0) {
		errors.ingredients = 'At least one ingredient is required';
	}

	if (!recipe.instructions || recipe.instructions.length === 0) {
		errors.instructions = 'At least one instruction is required';
	}

	if (recipe.prepTime && isNaN(parseInt(recipe.prepTime))) {
		errors.prepTime = 'Prep time must be a number';
	}

	if (recipe.cookTime && isNaN(parseInt(recipe.cookTime))) {
		errors.cookTime = 'Cook time must be a number';
	}

	if (recipe.servings && (isNaN(parseInt(recipe.servings)) || parseInt(recipe.servings) < 1)) {
		errors.servings = 'Servings must be a positive number';
	}

	return errors;
};

// User registration validation
export const validateUserRegistration = (userData) => {
	const errors = {};

	if (!userData.name || userData.name.trim().length < 2) {
		errors.name = 'Name must be at least 2 characters long';
	}

	if (!userData.email || !isValidEmail(userData.email)) {
		errors.email = 'Please enter a valid email address';
	}

	if (!userData.password || !isValidPassword(userData.password)) {
		errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
	}

	if (userData.password !== userData.confirmPassword) {
		errors.confirmPassword = 'Passwords do not match';
	}

	return errors;
};

// Login validation
export const validateLogin = (credentials) => {
	const errors = {};

	if (!credentials.email || !isValidEmail(credentials.email)) {
		errors.email = 'Please enter a valid email address';
	}

	if (!credentials.password || credentials.password.length < 6) {
		errors.password = 'Password must be at least 6 characters long';
	}

	return errors;
};

// Generic form validation helper
export const validateField = (fieldName, value, rules = {}) => {
	if (rules.required && (!value || value.toString().trim() === '')) {
		return `${fieldName} is required`;
	}

	if (rules.minLength && value && value.length < rules.minLength) {
		return `${fieldName} must be at least ${rules.minLength} characters long`;
	}

	if (rules.maxLength && value && value.length > rules.maxLength) {
		return `${fieldName} must be no more than ${rules.maxLength} characters long`;
	}

	if (rules.pattern && value && !rules.pattern.test(value)) {
		return rules.patternMessage || `${fieldName} format is invalid`;
	}

	if (rules.email && value && !isValidEmail(value)) {
		return 'Please enter a valid email address';
	}

	if (rules.password && value && !isValidPassword(value)) {
		return 'Password must be at least 8 characters with uppercase, lowercase, and number';
	}

	return null;
};
