import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/services/schedulerService';
import { verifyTwitterConnection } from '@/lib/services/twitterService';
import { testEmailConnection } from '@/lib/services/emailService';
import { getTodaysCompletedTasks } from '@/lib/services/notionService';
import { validateEnvironmentVariables } from '@/lib/utils/validation';
import { getInitializationStatus } from '@/lib/utils/startup';
import logger from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('Status check requested');

    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';

    const systemStatus = getStatus();
    const envValid = validateEnvironmentVariables();
    
    const basicStatus = {
      status: envValid ? 'healthy' : 'degraded',
      service: 'twitter-automation',
      timestamp: systemStatus.currentTime,
      system: systemStatus,
      errorHandling: {
        initialized: getInitializationStatus(),
        globalErrorHandlers: 'active',
        emailNotifications: 'enabled',
        fallbackNotifications: 'configured'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        timezone: process.env.TIMEZONE || 'Asia/Kolkata',
        envConfigValid: envValid,
        criticalEnvVars: {
          emailUser: !!process.env.EMAIL_USER,
          emailPassword: !!process.env.EMAIL_USER,
          notificationEmail: !!process.env.ERROR_NOTIFICATION_EMAIL,
          notionApiKey: !!process.env.NOTION_API_KEY,
          twitterApiKey: !!process.env.TWITTER_API_KEY,
          geminiApiKey: !!process.env.GEMINI_API_KEY
        }
      }
    };

    if (!detailed) {
      return NextResponse.json(basicStatus, { status: 200 });
    }

    logger.info('Performing detailed status check');

    const statusChecks = await Promise.allSettled([
      verifyTwitterConnection(),
      testEmailConnection(),
      getTodaysCompletedTasks().then(() => true).catch(() => false)
    ]);

    const twitterStatus = statusChecks[0].status === 'fulfilled' ? statusChecks[0].value : false;
    const emailStatus = statusChecks[1].status === 'fulfilled' ? statusChecks[1].value : false;
    const notionStatus = statusChecks[2].status === 'fulfilled' ? statusChecks[2].value : false;

    const allServicesHealthy = twitterStatus && emailStatus && notionStatus;

    const detailedStatus = {
      ...basicStatus,
      integrations: {
        notion: {
          status: notionStatus ? 'healthy' : 'error',
          connected: notionStatus,
          description: 'Notion database connection for task retrieval'
        },
        twitter: {
          status: twitterStatus ? 'healthy' : 'error',
          connected: twitterStatus,
          description: 'Twitter API connection for posting tweets'
        },
        email: {
          status: emailStatus ? 'healthy' : 'error',
          connected: emailStatus,
          description: 'Email service for error and success notifications'
        },
        gemini: {
          status: process.env.GEMINI_API_KEY ? 'configured' : 'not-configured',
          connected: !!process.env.GEMINI_API_KEY,
          description: 'Google Gemini AI for content generation'
        }
      },
      errorHandling: {
        ...basicStatus.errorHandling,
        features: [
          'Retry mechanism with exponential backoff',
          'Fallback email notification system',
          'Detailed error context and stack traces',
          'Stage-based error tracking',
          'Global exception handling',
          'Process error monitoring'
        ]
      },
      overall: {
        status: allServicesHealthy ? 'healthy' : 'degraded',
        allServicesHealthy: allServicesHealthy,
        message: allServicesHealthy 
          ? 'All systems operational with enhanced error handling' 
          : 'Some services degraded - error notifications will be sent'
      }
    };

    logger.info('Detailed status check completed', {
      twitterStatus,
      emailStatus,
      notionStatus,
      allServicesHealthy
    });

    return NextResponse.json(detailedStatus, { 
      status: allServicesHealthy ? 200 : 503 
    });

  } catch (error) {
    logger.error('Status check failed', { error });
    
    return NextResponse.json({
      status: 'error',
      service: 'twitter-automation',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Status check failed'
    }, { status: 500 });
  }
}