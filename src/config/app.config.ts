export default () => ({
	environment: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	database_url: process.env.DATABASE_URL,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION,
	jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT || '6379', 10),
		username: process.env.REDIS_USERNAME || '',
		password: process.env.REDIS_PASSWORD || ''
	}
});
