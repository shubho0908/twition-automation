import { NextResponse } from 'next/server';
import { analyzeNotionPage } from '@/lib/services/notionService';
import { createTwitterPost } from '@/lib/services/geminiService';
import { postTwitterContent } from '@/lib/services/twitterService';
import { sendSuccessNotification } from '@/lib/services/emailService';
import { analyzeContent, validateTwitterContent } from '@/lib/utils/contentProcessor';
import { getCurrentTime } from '@/lib/services/schedulerService';
import { validateEnvironmentVariables } from '@/lib/utils/validation';
import logger from '@/lib/utils/logger';
import { handleError } from '@/lib/utils/errorHandler';
import type { NotionPageAnalysis } from '@/lib/types';

function extractPageIdFromHeaders(request: Request): string | null {
  const referrer = request.headers.get('referer') || request.headers.get('referrer');
  if (referrer) {
    const pageIdMatch = referrer.match(/[?&]p=([a-f0-9]{32})|\/([a-f0-9]{32})/i);
    if (pageIdMatch) {
      return pageIdMatch[1] || pageIdMatch[2];
    }
  }
  
  const notionPageHeader = request.headers.get('x-notion-page-id') || 
                           request.headers.get('notion-page-id') ||
                           request.headers.get('x-page-id');
  
  if (notionPageHeader) {
    return notionPageHeader;
  }
  
  const origin = request.headers.get('origin');
  if (origin && origin.includes('notion.so')) {
    const headers = Object.fromEntries(request.headers.entries());
    logger.info('Notion request headers', { headers, origin });
  }
  
  return null;
}

export async function POST(request: Request) {
  const startTime = getCurrentTime();
  let currentStage = 'initialization';
  
  try {
    const url = new URL(request.url);
    let pageId = url.searchParams.get('pageId');
    
    if (!pageId) {
      try {
        const body = await request.json();
        pageId = body.pageId || body.page_id;
      } catch {
      }
    }
    
    if (!pageId) {
      const notionPageId = extractPageIdFromHeaders(request);
      if (notionPageId) {
        pageId = notionPageId;
      }
    }
    
    logger.info('🚀 Starting automated Twitter posting workflow', { 
      timestamp: startTime,
      source: 'unified-endpoint',
      pageId: pageId || 'default',
      hasNotionContext: !!pageId
    });

    currentStage = 'environment-validation';
    logger.info('📋 Validating environment configuration');
    
    const envValid = validateEnvironmentVariables();
    if (!envValid) {
      throw new Error('Configuration error: Missing required environment variables');
    }

    currentStage = 'notion-data-fetch';
    
    if (!pageId) {
      throw new Error('No Notion page ID provided. Please provide pageId as a query parameter, in the request body, or ensure the request comes from a Notion context with proper headers.');
    }
    
    logger.info('📚 Analyzing Notion page for tasks and status', { pageId });
    
    const pageAnalysis: NotionPageAnalysis = await analyzeNotionPage(pageId);
    
    if (!pageAnalysis.shouldGenerateTweet) {
      logger.info('✅ Workflow completed - Tweet generation skipped', { 
        reason: pageAnalysis.reason,
        status: pageAnalysis.status,
        completedTasks: pageAnalysis.completedTasks.length,
        incompleteTasks: pageAnalysis.incompleteTasks.length
      });
      return NextResponse.json({
        success: true,
        message: `Tweet generation skipped: ${pageAnalysis.reason}`,
        action: 'skipped',
        data: {
          analysis: {
            status: pageAnalysis.status,
            completedTasks: pageAnalysis.completedTasks.length,
            incompleteTasks: pageAnalysis.incompleteTasks.length,
            reason: pageAnalysis.reason
          }
        },
        timestamp: getCurrentTime()
      });
    }

    const tasks = pageAnalysis.completedTasks;
    logger.info(`📋 Proceeding with ${tasks.length} completed task(s) - ${pageAnalysis.reason}`);

    currentStage = 'content-analysis';
    logger.info('🔍 Analyzing content structure and complexity');
    
    const contentAnalysis = analyzeContent(tasks);
    logger.info('📊 Content analysis completed', { 
      taskCount: contentAnalysis.taskCount,
      contentType: contentAnalysis.contentType,
      complexity: contentAnalysis.complexity 
    });

    currentStage = 'ai-content-generation';
    logger.info('🤖 Generating Twitter content with Gemini AI');
    
    const twitterContent = await createTwitterPost(tasks);
    
    if (!twitterContent) {
      throw new Error('AI content generation failed - no content returned');
    }

    currentStage = 'content-validation';
    logger.info('✅ Validating generated Twitter content');
    
    const isValid = validateTwitterContent(twitterContent);
    if (!isValid) {
      throw new Error('Generated content validation failed: Content does not meet Twitter requirements');
    }

    currentStage = 'twitter-posting';
    logger.info('🐦 Posting content to Twitter', { 
      contentType: twitterContent.type,
      threadLength: Array.isArray(twitterContent.content) ? twitterContent.content.length : 1
    });
    
    const postResult = await postTwitterContent(twitterContent);
    
    if (!postResult.success) {
      throw new Error(`Twitter posting failed: ${postResult.error}`);
    }

    currentStage = 'notification-success';
    logger.info('📧 Sending success notification');
    
    await sendSuccessNotification(twitterContent, postResult, tasks.length);
    const endTime = getCurrentTime();
    const duration = Date.now() - Date.parse(startTime);

    logger.info('🎉 Automation workflow completed successfully', {
      startTime,
      endTime,
      duration: `${duration}ms`,
      tasksProcessed: tasks.length,
      tweetsPosted: postResult.tweetIds.length
    });

    return NextResponse.json({
      success: true,
      message: `Successfully posted ${postResult.tweetIds.length} tweet(s) from ${tasks.length} completed task(s)`,
      data: {
        analysis: {
          status: pageAnalysis.status,
          reason: pageAnalysis.reason,
          completedTasks: pageAnalysis.completedTasks.length,
          incompleteTasks: pageAnalysis.incompleteTasks.length
        },
        tasks: {
          count: tasks.length,
          titles: tasks.map(task => task.title)
        },
        content: {
          type: twitterContent.type,
          tweets: postResult.tweetIds.length
        },
        twitter: {
          tweetIds: postResult.tweetIds,
          success: true
        },
        timing: {
          startTime,
          endTime,
          duration: `${duration}ms`
        }
      },
      metadata: {
        stage: 'completed',
        source: 'unified-automation-endpoint',
        version: '1.0.0'
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const endTime = getCurrentTime();

    logger.error('❌ Automation workflow failed', {
      stage: currentStage,
      error: errorMessage,
      startTime,
      endTime
    });

    // Handle error with central error handler (includes email notification)
    await handleError(error as Error, `automation-workflow/${currentStage}`);

    return NextResponse.json({
      success: false,
      message: 'Automation workflow failed',
      error: {
        message: errorMessage,
        stage: currentStage,
        timestamp: endTime
      },
      debug: {
        startTime,
        failedAt: endTime,
        stage: currentStage
      }
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  try {
    const envValid = validateEnvironmentVariables();
    
    return NextResponse.json({
      status: 'ready',
      message: 'Unified automation endpoint is ready',
      configuration: {
        environment: envValid ? 'valid' : 'invalid'
      },
      endpoints: {
        trigger: 'POST /api/automate',
        health: 'GET /api/automate'
      },
      timestamp: getCurrentTime()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Configuration error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}