// config/env.ts
function validateEnv() {
    const requiredEnvVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'TURSO_DATABASE_URL',
      'TURSO_AUTH_TOKEN',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
      'REDIS_URL'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );
    
    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      );
    }
  }
  
  // Run validation in development, but only log warnings in production
  export function initializeConfig() {
    try {
      if (process.env.NODE_ENV === 'development') {
        validateEnv();
      } else {
        validateEnv();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        console.error(error);
      }
    }
  }