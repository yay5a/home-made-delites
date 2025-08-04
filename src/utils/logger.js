/**
 * Centralized logging utility for Home Made Delites
 *
 * Provides consistent logging across the application with environment-based verbosity control.
 * In production, only warnings and errors are logged by default.
 * In development, all log levels are shown.
 */

// Log level constants
const LogLevels = {
	ERROR: 0,
	WARN: 1,
	INFO: 2,
	DEBUG: 3,
};

// Current log level based on environment
const CURRENT_LOG_LEVEL =
	process.env.NODE_ENV === 'production'
		? parseInt(process.env.LOG_LEVEL) || LogLevels.WARN // Default to WARN in production
		: parseInt(process.env.LOG_LEVEL) || LogLevels.DEBUG; // Default to DEBUG in development

/**
 * Format log messages consistently
 * @param {string} level - Log level name
 * @param {string} message - Main message
 * @param {*} data - Additional data to log
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (level, message, data) => {
	const timestamp = new Date().toISOString();
	return `[${timestamp}] [${level}] ${message}${
		data !== undefined ? ': ' + JSON.stringify(data) : ''
	}`;
};

const logger = {
	/**
	 * Log error messages (always logged in all environments)
	 * @param {string} message - Error message
	 * @param {*} error - Error object or additional data
	 */
	error: (message, error) => {
		if (CURRENT_LOG_LEVEL >= LogLevels.ERROR) {
			console.error(formatLogMessage('ERROR', message, error));
		}
	},

	/**
	 * Log warning messages
	 * @param {string} message - Warning message
	 * @param {*} data - Additional data
	 */
	warn: (message, data) => {
		if (CURRENT_LOG_LEVEL >= LogLevels.WARN) {
			console.warn(formatLogMessage('WARN', message, data));
		}
	},

	/**
	 * Log informational messages
	 * @param {string} message - Info message
	 * @param {*} data - Additional data
	 */
	info: (message, data) => {
		if (CURRENT_LOG_LEVEL >= LogLevels.INFO) {
			console.info(formatLogMessage('INFO', message, data));
		}
	},

	/**
	 * Log debug messages (only in development by default)
	 * @param {string} message - Debug message
	 * @param {*} data - Additional data
	 */
	debug: (message, data) => {
		if (CURRENT_LOG_LEVEL >= LogLevels.DEBUG) {
			console.log(formatLogMessage('DEBUG', message, data));
		}
	},
};

export default logger;
