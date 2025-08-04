// Test script to verify ApiUsage model functionality
import dbConnect from './src/lib/mongoose.js';
import ApiUsage from './src/models/ApiUsage.js';

async function testApiUsage() {
	try {
		console.log('Testing ApiUsage model...');

		// Connect to database
		await dbConnect();
		console.log('✓ Database connected');

		// Try to find or create a usage record
		let usage = await ApiUsage.findOne({ trackingId: 'test' });

		if (!usage) {
			usage = new ApiUsage({
				trackingId: 'test',
				minuteHits: 1,
				monthHits: 1,
				dayAssistantCalls: 1,
				dayAssistantTokens: 100,
			});
			await usage.save();
			console.log('✓ Created new ApiUsage record:', usage.trackingId);
		} else {
			console.log('✓ Found existing ApiUsage record:', usage.trackingId);
		}

		// Test updating the record
		usage.minuteHits += 1;
		await usage.save();
		console.log('✓ Updated ApiUsage record');

		// Clean up test data
		await ApiUsage.deleteOne({ trackingId: 'test' });
		console.log('✓ Cleaned up test data');

		console.log('✅ All tests passed!');
	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testApiUsage();
}

export { testApiUsage };
