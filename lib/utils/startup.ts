import logger from './logger';
import { handleProcessError } from './errorHandler';
import { sendServiceStartupNotification } from '../services/emailService';

let isInitialized = false;

export const initializeErrorHandling = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  try {
    logger.info('Initializing Twitter Automation service error handling');
    
    handleProcessError();
    
    logger.info('Global error handlers registered successfully');
    
    if (process.env.NODE_ENV === 'production' || process.env.SEND_STARTUP_NOTIFICATION === 'true') {
      await sendServiceStartupNotification();
    }
    
    logger.info('Twitter Automation service initialized with enhanced error handling');
    
    isInitialized = true;
    
  } catch (error) {
    logger.error('Failed to initialize error handling', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getInitializationStatus = (): boolean => {
  return isInitialized;
};