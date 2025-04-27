import dotenv from 'dotenv'

dotenv.config()

const getEnv = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`❌ Missing environment variable: ${key}`);
    }
    return value;
}

export const config: { port: string } = {
    port: getEnv('PORT')
}