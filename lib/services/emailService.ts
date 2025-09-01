import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import { handleError } from '../utils/errorHandler';
import type { TwitterContent, PostResult, NodemailerTransporter, NodemailerConfig } from '../types';

let transporter: NodemailerTransporter | null = null;

const initializeTransporter = (): NodemailerTransporter => {
  if (transporter) {
    return transporter;
  }

  const emailConfig: NodemailerConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  };

  transporter = nodemailer.createTransport(emailConfig) as NodemailerTransporter;
  
  logger.info('Email transporter initialized', { 
    service: emailConfig.service,
    user: emailConfig.auth.user 
  });

  return transporter;
};

export const sendErrorNotification = async (
  errorMessage: string, 
  errorStack: string, 
  context?: string
): Promise<void> => {
  const emailTransporter = initializeTransporter();
  
  const subject = `🚨 Twitter Automation Error${context ? ` - ${context}` : ''}`;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
            🚨 Twitter Automation Error Alert
          </h2>
          
          <div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #721c24;">⚠️ Critical Error Detected</h3>
            <p><strong>Context:</strong> ${context || 'General Error'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: process.env.TIMEZONE || 'UTC' })}</p>
            <p><strong>Severity:</strong> HIGH</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border: 3px solid #dc3545; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(220, 53, 69, 0.1);">
            <h3 style="margin-top: 0; color: #dc3545; text-align: center; font-size: 18px;">🔥 MAIN ERROR MESSAGE</h3>
            <div style="background: linear-gradient(135deg, #ffe6e9, #fff5f5); padding: 15px; border-radius: 6px; border: 2px solid #dc3545;">
              <p style="font-family: monospace; color: #721c24; font-weight: bold; font-size: 16px; margin: 0; text-align: center; word-break: break-word;">${errorMessage}</p>
            </div>
          </div>

          <div style="background-color: #f1f3f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #495057;">📋 Complete Stack Trace & Logs:</h4>
            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 4px;">
              <h5 style="margin-top: 0; color: #6c757d; font-size: 14px;">Stack Trace:</h5>
              <pre style="background-color: #f8f9fa; padding: 10px; border: 1px solid #e9ecef; border-radius: 3px; overflow-x: auto; font-size: 12px; max-height: 200px; overflow-y: auto; margin: 0;">${errorStack}</pre>
            </div>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 5px;">
            <h4 style="margin-top: 0; color: #856404;">🔧 Action Required:</h4>
            <ul style="color: #856404;">
              <li>Check application logs for detailed information</li>
              <li>Verify all service connections (Notion, Twitter, Gemini API)</li>
              <li>Ensure all environment variables are properly configured</li>
              <li>Check service rate limits and quotas</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
            <p>🤖 This is an automated critical error notification from your Twitter Automation service.</p>
            <p>Please investigate and resolve this issue immediately to restore service functionality.</p>
            <p><strong>System Status:</strong> <span style="color: #dc3545; font-weight: bold;">ERROR - Service Degraded</span></p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: process.env.ERROR_NOTIFICATION_EMAIL!,
    subject: subject,
    html: htmlContent,
    priority: 'high' as const,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high'
    }
  };

  await emailTransporter.sendMail(mailOptions);
  
  logger.info('Error notification email sent successfully', {
    to: process.env.ERROR_NOTIFICATION_EMAIL,
    subject: subject,
    context: context
  });
};

export const sendSuccessNotification = async (
  content: TwitterContent,
  postResult: PostResult,
  taskCount: number
): Promise<void> => {
  try {
    const emailTransporter = initializeTransporter();
    
    const subject = `✅ Twitter Automation Success - ${taskCount} task${taskCount !== 1 ? 's' : ''} posted`;
    
    const contentPreview = content.type === 'single' 
      ? (content.content as string).substring(0, 150) + '...'
      : `Thread with ${(content.content as string[]).length} tweets`;

    const tweetLinks = postResult.tweetIds.map(id => 
      `https://twitter.com/i/web/status/${id}`
    ).join('\n');

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              ✅ Twitter Automation Success
            </h2>
            
            <div style="background-color: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #0c5460;">🎯 Mission Accomplished!</h3>
              <p>Your automation workflow completed successfully without any errors.</p>
            </div>
            
            <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #155724;">📊 Execution Summary:</h3>
              <p><strong>Tasks Processed:</strong> ${taskCount}</p>
              <p><strong>Content Type:</strong> ${content.type === 'single' ? '📝 Single Tweet' : '🧵 Twitter Thread'}</p>
              <p><strong>Tweets Posted:</strong> ${postResult.tweetIds.length}</p>
              <p><strong>Success Rate:</strong> 100%</p>
              <p><strong>Completion Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: process.env.TIMEZONE || 'UTC' })}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0;">📝 Content Preview:</h4>
              <p style="font-style: italic; background-color: #fff; padding: 15px; border-left: 3px solid #007bff; margin: 10px 0; border-radius: 3px;">
                "${contentPreview}"
              </p>
            </div>

            ${postResult.tweetIds.length > 0 ? `
            <div style="background-color: #e2e3e5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4 style="margin-top: 0;">🔗 Published Tweet Links:</h4>
              <div style="font-family: monospace; font-size: 14px; line-height: 1.8;">
                ${tweetLinks.split('\n').map(link => `<div style="margin: 5px 0;"><a href="${link}" style="color: #1da1f2; text-decoration: none; background-color: #f8f9fa; padding: 8px; border-radius: 4px; display: inline-block;">🐦 ${link}</a></div>`).join('')}
              </div>
            </div>
            ` : ''}

            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 5px;">
              <h4 style="margin-top: 0; color: #856404;">📈 Next Steps:</h4>
              <ul style="color: #856404;">
                <li>Monitor engagement on your published tweets</li>
                <li>Check analytics for performance metrics</li>
                <li>Review tomorrow's tasks for the next automation cycle</li>
              </ul>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
              <p>🎉 Excellent work! Your daily productivity has been successfully showcased on Twitter.</p>
              <p>🤖 This automated notification confirms all systems are working perfectly.</p>
              <p><strong>System Status:</strong> <span style="color: #28a745; font-weight: bold;">✅ ALL SERVICES OPERATIONAL</span></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER!,
      to: process.env.ERROR_NOTIFICATION_EMAIL!,
      subject: subject,
      html: htmlContent,
    };

    await emailTransporter.sendMail(mailOptions);
    
    logger.info('Success notification email sent successfully', {
      to: process.env.ERROR_NOTIFICATION_EMAIL!,
      subject: subject,
      tweetCount: postResult.tweetIds.length,
      taskCount: taskCount
    });

  } catch (error) {
    logger.error('Failed to send success notification email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      taskCount,
      tweetCount: postResult.tweetIds.length
    });
    await handleError(error as Error, 'sendSuccessNotification');
  }
};

export const testEmailConnection = async (): Promise<boolean> => {
  try {
    logger.info('Testing email connection');
    
    const emailTransporter = initializeTransporter();
    
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.ERROR_NOTIFICATION_EMAIL!,
      subject: '🧪 Twitter Automation - Email Test',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h2 style="color: #007bff; text-align: center;">📧 Email Connection Test</h2>
              
              <div style="background-color: #d1ecf1; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h3 style="color: #0c5460; margin-top: 0;">🎯 Test Successful!</h3>
                <p>This email confirms that your Twitter Automation service can send notifications successfully.</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin-top: 0;">📋 Test Details:</h4>
                <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: process.env.TIMEZONE || 'UTC' })}</p>
                <p><strong>Email Service:</strong> ${process.env.EMAIL_SERVICE || 'Gmail'}</p>
                <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
                <p><strong>To:</strong> ${process.env.ERROR_NOTIFICATION_EMAIL}</p>
              </div>
              
              <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 5px;">
                <p style="color: #155724; font-weight: bold; margin: 0;">✅ Email notification system is working correctly!</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                <p>🤖 Automated test from Twitter Automation Service</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    logger.info('Test email sent successfully');
    return true;

  } catch (error) {
    await handleError(error as Error, 'testEmailConnection');
    return false;
  }
};

export const sendServiceStartupNotification = async (): Promise<void> => {
  try {
    const emailTransporter = initializeTransporter();
    
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.ERROR_NOTIFICATION_EMAIL!,
      subject: '🚀 Twitter Automation Service Started',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h2 style="color: #28a745; text-align: center;">🚀 Service Startup Notification</h2>
              
              <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h3 style="color: #155724; margin-top: 0;">✅ All Systems Online</h3>
                <p>Your Twitter Automation service has started successfully and is ready to process tasks.</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin-top: 0;">📋 Startup Details:</h4>
                <p><strong>Startup Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: process.env.TIMEZONE || 'UTC' })}</p>
                <p><strong>Status:</strong> All services initialized</p>
                <p><strong>Email Notifications:</strong> ✅ Active</p>
                <p><strong>Error Handling:</strong> ✅ Enhanced with fallback</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                <p>🤖 System is monitoring for any issues and will send immediate notifications if problems occur.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    logger.info('Service startup notification sent successfully');
  } catch (error) {
    logger.error('Failed to send startup notification', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};