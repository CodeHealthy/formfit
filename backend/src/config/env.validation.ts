type EnvironmentVariables = {
    NODE_ENV?: string;
    PORT?: string;
    FRONTEND_URL?: string;
    MONGODB_URI?: string;
    MONGODB_DB_NAME?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_PRICE_ID_PRO?: string;
    FRONTEND_BILLING_SUCCESS_URL?: string;
    FRONTEND_BILLING_CANCEL_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    BCRYPT_SALT_ROUNDS?: string;
};

export function validateEnv(config: EnvironmentVariables) {
    const requiredVariables = [
        'NODE_ENV',
        'PORT',
        'FRONTEND_URL',
        'MONGODB_URI',
        'MONGODB_DB_NAME',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_PRICE_ID_PRO',
        'FRONTEND_BILLING_SUCCESS_URL',
        'FRONTEND_BILLING_CANCEL_URL',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'BCRYPT_SALT_ROUNDS',
    ] as const;

    for (const variable of requiredVariables) {
        if (!config[variable]) {
            throw new Error(`Missing required environment variable: ${variable}`);
        }
    }

    const port = Number(config.PORT);

    if (Number.isNaN(port) || port <= 0) {
        throw new Error('PORT must be a valid positive number');
    }

    const bcryptSaltRounds = Number(config.BCRYPT_SALT_ROUNDS);

    if (Number.isNaN(bcryptSaltRounds) || bcryptSaltRounds <= 0) {
        throw new Error('BCRYPT_SALT_ROUNDS must be a valid positive number');
    }

    return {
        NODE_ENV: config.NODE_ENV,
        PORT: port,
        FRONTEND_URL: config.FRONTEND_URL,
        MONGODB_URI: config.MONGODB_URI,
        MONGODB_DB_NAME: config.MONGODB_DB_NAME,
        STRIPE_SECRET_KEY: config.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: config.STRIPE_WEBHOOK_SECRET,
        STRIPE_PRICE_ID_PRO: config.STRIPE_PRICE_ID_PRO,
        FRONTEND_BILLING_SUCCESS_URL: config.FRONTEND_BILLING_SUCCESS_URL,
        FRONTEND_BILLING_CANCEL_URL: config.FRONTEND_BILLING_CANCEL_URL,
        JWT_SECRET: config.JWT_SECRET,
        JWT_EXPIRES_IN: config.JWT_EXPIRES_IN,
        BCRYPT_SALT_ROUNDS: config.BCRYPT_SALT_ROUNDS,
    };
}