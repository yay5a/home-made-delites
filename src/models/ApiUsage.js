import mongoose from 'mongoose';

const ApiUsageSchema = new mongoose.Schema({
	minuteHits: { type: Number, default: 0 },
	monthHits: { type: Number, default: 0 },
	lastMinuteReset: { type: Date, default: Date.now },
	lastMonthReset: { type: Date, default: Date.now },
});

export default mongoose.models.ApiUsage || mongoose.model('ApiUsage', ApiUsageSchema);
