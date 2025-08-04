import mongoose from 'mongoose';

// Ensure mongoose is properly initialized
if (!mongoose.models) {
	mongoose.models = {};
}

const ApiUsageSchema = new mongoose.Schema(
	{
		// Tracking ID
		trackingId: {
			type: String,
			default: 'global',
			unique: true,
			index: true, // Add index for faster lookups
		},

		// Minute-based tracking
		minuteHits: {
			type: Number,
			default: 0,
		},
		lastMinuteReset: {
			type: Date,
			default: Date.now,
		},

		// Day-based tracking
		dayAssistantCalls: {
			type: Number,
			default: 0,
		},
		dayAssistantTokens: {
			type: Number,
			default: 0,
		},
		lastDayReset: {
			type: Date,
			default: Date.now,
		},

		// Month-based tracking
		monthAssistantCalls: {
			type: Number,
			default: 0,
		},
		monthHits: {
			type: Number,
			default: 0,
		},
		lastMonthReset: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Ensure mongoose.models exists before accessing it
let ApiUsage;
try {
	ApiUsage =
		(mongoose.models && mongoose.models.ApiUsage) || mongoose.model('ApiUsage', ApiUsageSchema);
} catch (error) {
	console.error('Error creating ApiUsage model:', error);
	// Fallback: create the model without checking existing models
	ApiUsage = mongoose.model('ApiUsage', ApiUsageSchema);
}

export default ApiUsage;
