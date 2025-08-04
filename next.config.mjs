/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Fallback for Node.js modules that should not be bundled in the client
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				os: false,
				path: false,
				crypto: false,
			};
		}
		return config;
	},
	serverExternalPackages: ['bcrypt'],
};

export default nextConfig;
