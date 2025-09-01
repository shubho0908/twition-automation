import logger from './logger';
import { sendErrorNotification } from '../services/emailService';
import type { AppError } from '../types';

export const createError = (message: string, statusCode: number = 500, isOperational: boolean = true): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction = (...args: readonly any[]) => Promise<any>;

export const withErrorHandling = <T extends AsyncFunction>(
  fn: T,
  context: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleError(error as Error, context);
      throw error;
    }
  }) as T;
};

export const handleError = async (error: AppError | Error, context?: string): Promise<void> => {
  const errorMessage = `${context ? `[${context}] ` : ''}${error.message}`;
  const errorStack = error.stack || 'No stack trace available';

  logger.error(errorMessage, {
    stack: errorStack,
    context,
    timestamp: new Date().toISOString()
  });

  await guaranteedEmailNotification(errorMessage, errorStack, context);
};

const guaranteedEmailNotification = async (errorMessage: string, errorStack: string, context?: string, retries: number = 3): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sendErrorNotification(errorMessage, errorStack, context);
      logger.info('Error notification email sent successfully', { attempt, context });
      return;
    } catch (emailError) {
      logger.error(`Failed to send error notification email (attempt ${attempt}/${retries})`, { 
        error: emailError instanceof Error ? emailError.message : 'Unknown error',
        originalError: errorMessage,
        attempt
      });
      
      if (attempt === retries) {
        logger.error('All email notification attempts failed - using alternative notification methods', {
          originalError: errorMessage,
          totalAttempts: retries
        });
        await fallbackNotification(errorMessage, errorStack, context);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
};

const fallbackNotification = async (errorMessage: string, errorStack: string, context?: string): Promise<void> => {
  try {
    logger.error('CRITICAL ERROR - EMAIL NOTIFICATION FAILED', {
      error: errorMessage,
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
      fallbackUsed: true
    });
    
    const fallbackEmail = process.env.FALLBACK_EMAIL || process.env.ERROR_NOTIFICATION_EMAIL;
    if (fallbackEmail && fallbackEmail !== process.env.ERROR_NOTIFICATION_EMAIL) {
      const nodemailer = await import('nodemailer');
      const basicTransporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      await basicTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: fallbackEmail,
        subject: `CRITICAL: Twitter Automation Failure - Primary Email Failed`,
        text: `CRITICAL ERROR - Primary email notification system failed

Original Error: ${errorMessage}

Stack Trace: ${errorStack}

Context: ${context || 'None'}

Time: ${new Date().toISOString()}

This message was sent using fallback email system because primary email notifications failed.`
      });
      
      logger.info('Fallback email notification sent successfully');
    }
  } catch (fallbackError) {
    logger.error('Fallback notification also failed', {
      fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
      originalError: errorMessage
    });
  }
};

export const isOperationalError = (error: AppError | Error): boolean => {
  return (error as AppError).isOperational || false;
};

export const handleProcessError = () => {
  process.on('uncaughtException', async (error: Error) => {
    logger.error('Uncaught Exception:', error);
    await handleError(error, 'UNCAUGHT_EXCEPTION');
    setTimeout(() => process.exit(1), 5000);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process.on('unhandledRejection', async (reason: string | Error, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await handleError(new Error(String(reason)), 'UNHANDLED_REJECTION');
  });

  process.on('exit', async (code) => {
    if (code !== 0) {
      logger.error('Process exiting with error code', { code });
      await handleError(new Error(`Process exited with code ${code}`), 'PROCESS_EXIT');
    }
  });
};