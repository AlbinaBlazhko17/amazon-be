export default () => ({
	environment: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	database_url: process.env.DATABASE_URL,
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT || '6379', 10),
		username: process.env.REDIS_USERNAME || '',
		password: process.env.REDIS_PASSWORD || ''
	}
});
