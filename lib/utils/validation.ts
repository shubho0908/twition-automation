import logger from './logger';

export const validateEnvironmentVariables = (): boolean => {
  const required = [
    'NOTION_API_KEY',
    'NOTION_PAGE_ID', 
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_TOKEN_SECRET',
    'GEMINI_API_KEY',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'ERROR_NOTIFICATION_EMAIL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    return false;
  }

  logger.info('All required environment variables are present');
  return true;
};

export const validateTweetLength = (tweet: string): boolean => {
  return tweet.length <= 280;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};