# Twitter Automation Backend - Implementation Instructions

## Overview

This backend service automates Twitter posting by extracting completed tasks from a Notion page, processing them with Gemini AI, and posting to Twitter at scheduled times.

**Workflow Timeline:**
- **8:30 PM**: Service starts and processes content
- **9:00 PM**: Posts are published to Twitter

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cron Trigger  │───▶│  Main Service    │───▶│  Notion API     │
│   (8:30 PM)     │    │  Orchestrator    │    │  Integration    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Twitter API    │◀───│  Content         │◀───│  Content        │
│  (Scheduled     │    │  Processor       │    │  Extractor      │
│   9:00 PM)      │    │  (Gemini AI)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│  Error Handler  │    │  Email Service   │
│  & Logger       │    │  (Notifications) │
└─────────────────┘    └──────────────────┘
```

## Prerequisites

### Required API Keys & Accounts
1. **Notion Integration** - Create at https://developers.notion.com/
2. **Twitter Developer Account** - Apply at https://developer.twitter.com/
3. **Google AI Studio** - Get Gemini API key at https://ai.google.dev/
4. **Email Service** - Gmail App Password or SendGrid account

### System Requirements
- Node.js 18+
- Linux/macOS server (for cron jobs)
- Stable internet connection

## Project Setup

### 1. Initialize Project Structure

Create directory and initialize npm package

### 2. Install Dependencies

Core dependencies:
- @notionhq/client
- @google/generative-ai
- twitter-api-v2
- nodemailer
- node-cron
- dotenv
- winston
- axios
- moment-timezone

Development dependencies:
- nodemon
- @types/node
- typescript

### 3. Project Directory Structure

```
twitter-automation-backend/
├── src/
│   ├── services/
│   │   ├── notionService.js
│   │   ├── geminiService.js
│   │   ├── twitterService.js
│   │   ├── emailService.js
│   │   └── schedulerService.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── contentProcessor.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── environment.js
│   └── app.js
├── logs/
├── .env
├── package.json
└── instructions.md (this file)
```

## Implementation Guide

### 1. Environment Configuration

Create `.env` file with:
- NOTION_API_KEY
- NOTION_PAGE_ID
- TWITTER_API_KEY
- TWITTER_API_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET
- TWITTER_BEARER_TOKEN
- GEMINI_API_KEY
- EMAIL_SERVICE
- EMAIL_USER
- EMAIL_PASSWORD
- ERROR_NOTIFICATION_EMAIL=shubhobera98@gmail.com
- TIMEZONE=Asia/Kolkata

### 2. Core Services Implementation

#### A. Notion Service
- Connect to Notion API using client
- Query database for today's completed tasks (marked with ✅)
- Extract task titles and context from page content
- Handle pagination and error cases
- Return structured content array

**Key Methods:**
- getTodaysCompletedTasks(): Query today's completed entries
- extractContentFromPages(): Extract text content from Notion pages
- extractTextFromBlocks(): Parse Notion block structure for text

#### B. Gemini Service
- Initialize Google Generative AI client
- Create Twitter-optimized content from extracted tasks
- Handle both single tweets and thread creation
- Parse AI responses into usable formats

**Key Methods:**
- createTwitterPost(): Generate single tweet content
- createTwitterThread(): Create multi-tweet thread
- createTwitterPrompt(): Build prompt for single tweet
- createThreadPrompt(): Build prompt for thread
- parseThreadResponse(): Parse AI response into tweet array

#### C. Content Processor
- Analyze total content length
- Determine whether to create single tweet or thread
- Apply content length rules:
  - ≤500 chars: Single tweet
  - 500-800 chars: Summarized single tweet
  - >800 chars: Thread
- Coordinate with Gemini service for processing

#### D. Twitter Service
- Initialize Twitter API v2 client
- Post single tweets with error handling
- Create threaded posts with proper reply chains
- Handle rate limiting with delays between posts
- Return post IDs and metadata

**Key Methods:**
- postSingleTweet(): Publish individual tweet
- postThread(): Publish tweet thread with replies
- delay(): Helper for rate limit management

#### E. Email Service
- Configure nodemailer transport
- Send error notifications to shubhobera98@gmail.com
- Send success notifications with post details
- Handle email service failures gracefully

**Key Methods:**
- sendErrorNotification(): Alert on system errors
- sendSuccessNotification(): Confirm successful posts

#### F. Scheduler Service
- Use node-cron for daily scheduling
- Start main process at 8:30 PM
- Schedule delayed posting for 9:00 PM
- Handle timezone considerations
- Manage timing across process execution

**Key Methods:**
- start(): Initialize daily cron job
- schedulePost(): Queue post for 9:00 PM execution

### 3. Main Application
- Orchestrate all services
- Implement main workflow logic
- Handle graceful shutdowns
- Coordinate error handling across components

**Main Flow:**
1. Extract content from Notion
2. Process content with Gemini AI
3. Schedule post for 9:00 PM
4. Execute Twitter posting
5. Send notifications

### 4. Utility Files

#### Logger
- Winston-based logging system
- Multiple transport targets (file + console)
- Error and combined log files
- Structured JSON logging

## Deployment Instructions

### 1. Server Setup
1. Clone repository to server
2. Install dependencies
3. Configure environment variables
4. Create logs directory
5. Test individual services

### 2. Process Management with PM2
- Install PM2 globally
- Start service with PM2
- Configure auto-restart
- Set up system startup

### 3. Monitoring & Logs
- Monitor with PM2
- View logs through PM2 interface
- Set up log rotation
- Configure alerts

## Testing Strategy

### 1. Individual Service Tests
Create test scripts for each service:
- Test Notion connection and data extraction
- Verify Twitter API authentication
- Test Gemini AI content generation
- Validate email notifications

### 2. End-to-End Testing
- Full pipeline test with mock data
- Timing verification
- Error scenario testing
- Content quality validation

## Error Handling & Monitoring

### Common Issues & Solutions

1. **Notion API Rate Limits:**
   - Implement exponential backoff
   - Cache results when possible

2. **Twitter API Errors:**
   - Handle duplicate content detection
   - Implement retry logic

3. **Gemini API Failures:**
   - Fallback to template-based posting
   - Implement content validation

4. **Cron Job Issues:**
   - Use PM2 for process management
   - Implement health checks

### Monitoring Setup

1. **Log Analysis:**
   - Use log aggregation tools
   - Set up alerts for errors

2. **API Monitoring:**
   - Track API response times
   - Monitor rate limit usage

3. **Success Metrics:**
   - Daily successful posts
   - Content processing time
   - Error rates

## Security Considerations

1. **API Key Management:**
   - Use environment variables
   - Rotate keys regularly
   - Implement key validation

2. **Rate Limiting:**
   - Respect API limits
   - Implement backoff strategies

3. **Content Validation:**
   - Sanitize extracted content
   - Validate tweet length
   - Filter sensitive information

## Maintenance Tasks

### Weekly Tasks
- Review error logs
- Check API usage metrics
- Validate post quality

### Monthly Tasks
- Update dependencies
- Rotate API keys
- Review and optimize prompts

### Quarterly Tasks
- Performance optimization
- Feature updates
- Security audit

## Support & Troubleshooting

### Debug Mode
Set environment variable: `DEBUG=true` for verbose logging

### Common Commands
- View recent logs with tail command
- Check service status with PM2
- Restart service with new environment variables

This comprehensive guide provides everything needed to build and deploy the Twitter automation backend service. Follow each section carefully and test thoroughly before production deployment.