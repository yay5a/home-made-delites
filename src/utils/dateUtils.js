// Format date to readable string
export const formatDate = (date, options = {}) => {
	if (!date) return '';

	const defaultOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	const formatOptions = { ...defaultOptions, ...options };

	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('en-US', formatOptions);
	} catch (error) {
		console.error('Error formatting date:', error);
		return '';
	}
};

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
	if (!date) return '';

	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		const now = new Date();
		const diffInSeconds = Math.floor((now - dateObj) / 1000);

		if (diffInSeconds < 60) {
			return 'just now';
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
		}

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) {
			return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) {
			return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
		}

		const diffInYears = Math.floor(diffInDays / 365);
		return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
	} catch (error) {
		console.error('Error formatting relative time:', error);
		return '';
	}
};

// Format cooking time (e.g., "1h 30m")
export const formatCookingTime = (minutes) => {
	if (!minutes || minutes <= 0) return '';

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) {
		return `${remainingMinutes}m`;
	}

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}m`;
};

// Parse cooking time string to minutes
export const parseCookingTime = (timeString) => {
	if (!timeString) return 0;

	const hoursMatch = timeString.match(/(\d+)h/);
	const minutesMatch = timeString.match(/(\d+)m/);

	const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
	const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

	return hours * 60 + minutes;
};

// Get start and end of day for date filtering
export const getStartOfDay = (date = new Date()) => {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	return start;
};

export const getEndOfDay = (date = new Date()) => {
	const end = new Date(date);
	end.setHours(23, 59, 59, 999);
	return end;
};

// Date range helpers
export const isToday = (date) => {
	const today = new Date();
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toDateString() === today.toDateString();
};

export const isYesterday = (date) => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toDateString() === yesterday.toDateString();
};

export const isThisWeek = (date) => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const today = new Date();
	const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

	return dateObj >= weekAgo && dateObj <= today;
};

// Format date for input fields
export const formatDateForInput = (date) => {
	if (!date) return '';

	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toISOString().split('T')[0];
	} catch (error) {
		console.error('Error formatting date for input:', error);
		return '';
	}
};
