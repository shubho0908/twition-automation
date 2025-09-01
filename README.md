# Twitter Automation API (Twition)

A modern Next.js-based API service that automates Twitter posting by analyzing Notion pages for completed tasks, processing them with Google's Gemini AI, and posting to Twitter on-demand. Features a sleek web dashboard, intelligent content analysis, and robust error handling.

## 🚀 Features

- **Modern Web Dashboard**: Beautiful, responsive UI built with Next.js 15, React 19, and Tailwind CSS 4
- **Intelligent Page Analysis**: Analyzes Notion pages to determine completion status and task states
- **AI-Powered Content Generation**: Uses Google's Gemini AI to create engaging Twitter content
- **Smart Content Processing**: Automatically determines whether to create single tweets or threads based on content length
- **One-Click Automation**: Trigger complete workflow via web dashboard or API calls
- **Enhanced Error Handling**: Comprehensive error tracking with stage-based monitoring and notifications
- **Email Notifications**: Sends detailed success and error notifications via email
- **Comprehensive Logging**: Winston-based structured logging with error handling
- **Health Monitoring**: Built-in status checks and detailed service testing endpoints
- **Modern Architecture**: Uses Next.js App Router, TypeScript, and proper error boundaries
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **API Documentation**: Built-in interactive API documentation interface

## 📋 Prerequisites

Before setting up the service, ensure you have:

1. **Node.js 18+** installed
2. **pnpm** package manager (recommended) or npm
3. **Notion Integration** - [Create at developers.notion.com](https://developers.notion.com/)
4. **Twitter Developer Account** - [Apply at developer.twitter.com](https://developer.twitter.com/)
5. **Google AI Studio** - [Get Gemini API key at ai.google.dev](https://ai.google.dev/)
6. **Email Service** - Gmail App Password or SendGrid account

## 🛠 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd automate-twitter
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Configuration**:
   Copy the `.env.local` file and configure your API keys:
   
   ```env
   # Notion Configuration
   NOTION_API_KEY=your_notion_api_key_here

   # Twitter API Configuration  
   TWITTER_API_KEY=your_twitter_api_key_here
   TWITTER_API_SECRET=your_twitter_api_secret_here
   TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

   # Google AI (Gemini) Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   ERROR_NOTIFICATION_EMAIL=shubhobera98@gmail.com (change with yours primary email)

   # Application Configuration
   TIMEZONE=Asia/Kolkata
   DEBUG=false
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The development server uses Turbopack for faster builds and hot reloading.

## 🎯 Single Endpoint API

### Primary Endpoint

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/automate` | **POST** | **One-click complete automation** (Notion → AI → Twitter → Email) |
| `/api/automate` | GET | Health check and endpoint status |
| `/api/status` | GET | Comprehensive system health check with detailed service status |

### That's It! 🚀

No complex workflows, no multiple endpoints. One simple POST request handles everything:

```bash
# Complete automation in one call
curl -X POST https://twition.shubhojeet.com/api/automate

# Check if system is ready
curl https://twition.shubhojeet.com/api/automate
```

### Status Endpoint *(optional - for monitoring)*

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | System health check and service status |

```bash
# Check system status  
curl https://twition.shubhojeet.com/api/status?detailed=true
```

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js 15    │───▶│  Service Layer   │───▶│  External APIs  │
│   App Router    │    │  (TypeScript)    │    │   (Twitter,     │
│   + React 19    │    │                  │    │   Notion, AI)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Interactive    │    │   Utilities      │    │   Enhanced      │
│  Dashboard +    │    │ & Processors     │    │   Logging &     │
│  API Docs       │    │                  │    │   Monitoring    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Service Layer (`lib/services/`)

- **NotionService**: Analyzes Notion pages to determine completion status and extract completed tasks
- **GeminiService**: Generates Twitter-optimized content using Google's Gemini AI
- **TwitterService**: Posts content to Twitter with enhanced error handling (single tweets or threads)
- **EmailService**: Sends detailed notifications and alerts with formatting
- **SchedulerService**: Manages timing and system status

### Utility Layer (`lib/utils/`)

- **Logger**: Winston-based structured logging with error/info separation
- **ErrorHandler**: Centralized error handling with stage tracking and notifications
- **ContentProcessor**: Content analysis, validation, and complexity assessment
- **Validation**: Environment variable and configuration validation
- **Startup**: System initialization and health monitoring

## 🔗 Usage

### Web Dashboard

Visit your deployment URL to access the interactive dashboard where you can:
- Enter your Notion page ID
- Trigger automation with one click
- View real-time progress updates
- Monitor results and responses

### API Usage

Make a POST request to `/api/automate` with your Notion page ID:

```bash
# Trigger automation for a specific page
curl -X POST "https://twition.shubhojeet.com/api/automate?pageId=your-notion-page-id"

# Or include in request body
curl -X POST "https://twition.shubhojeet.com/api/automate" \
  -H "Content-Type: application/json" \
  -d '{"pageId": "your-notion-page-id"}'
```

## 📊 Enhanced Monitoring & Logging

### Interactive Dashboard

Access the modern web dashboard at your deployment URL for:
- Complete API documentation
- Interactive examples  
- One-click automation triggers
- Dark/light theme support
- Responsive design for mobile and desktop

### Log Files

- `logs/combined.log` - All application logs with timestamps
- `logs/error.log` - Error logs with stack traces and context

### Health Checks

```bash
# Quick health check
curl https://your-domain.com/api/automate

# Comprehensive status with service details
curl https://your-domain.com/api/status?detailed=true
```

## 🔧 How It Works

### Page Analysis Logic

The system analyzes your Notion page to determine if Twitter content should be generated:

1. **Page Status Check**: Analyzes todo items and completion status
2. **Content Extraction**: Extracts completed tasks and their details  
3. **Smart Decision Making**: Determines if the page is "done" based on task completion ratios
4. **Content Generation**: Only generates tweets when the page status indicates completion

### Notion Page Requirements

Your Notion page should contain todo items with checkboxes. The system will:
- Extract all todo items from the page
- Identify completed vs incomplete tasks
- Analyze completion ratios to determine page status
- Generate Twitter content only when appropriate conditions are met

## 🚀 Deployment

### Using Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy with automatic builds using Turbopack

The `vercel.json` configuration is included for optimal deployment.

### Using Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify** - Full-stack deployment with serverless functions
- **Railway** - Container-based deployment with automatic scaling
- **DigitalOcean App Platform** - Managed platform deployment
- **AWS Amplify** - Full-stack deployment with CI/CD

### Build Commands

```bash
# Development with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## 🧪 Testing

### Web Dashboard Testing

1. Navigate to your deployment URL
2. Use the interactive dashboard to test the automation
3. Check the API documentation examples
4. Toggle between dark and light themes

### API Testing

```bash
# Test automation with specific Notion page
curl -X POST "https://your-domain.com/api/automate?pageId=your-page-id"

# Check system health
curl https://your-domain.com/api/status?detailed=true

# Quick health check
curl https://your-domain.com/api/automate
```

## 🔒 Security Considerations

- **Environment Security**: All API keys stored in environment variables with validation
- **HTTPS**: Use HTTPS in production for secure communication
- **API Key Rotation**: Regularly rotate API keys for all services
- **Rate Limiting**: Monitor API usage and implement rate limit handling
- **Error Handling**: Enhanced error handling prevents sensitive information exposure
- **Input Validation**: Comprehensive validation for all inputs and configurations
- **Defensive Design**: Built with defensive security measures, no malicious use support

## 📁 Project Structure

```
automate-twitter/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── automate/
│   │   │   └── route.ts         # Main automation endpoint
│   │   └── status/
│   │       └── route.ts         # Health check endpoint
│   ├── docs/
│   │   └── page.tsx             # API documentation page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard page
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   └── mode-toggle.tsx          # Theme toggle
├── lib/                         # Core application logic
│   ├── services/                # External service integrations
│   │   ├── notionService.ts     # Notion API integration
│   │   ├── geminiService.ts     # Google AI integration
│   │   ├── twitterService.ts    # Twitter API integration
│   │   ├── emailService.ts      # Email notifications
│   │   └── schedulerService.ts  # Timing utilities
│   ├── utils/                   # Utility functions
│   │   ├── logger.ts            # Winston logging
│   │   ├── errorHandler.ts      # Error management
│   │   ├── contentProcessor.ts  # Content analysis
│   │   ├── validation.ts        # Environment validation
│   │   └── startup.ts           # System initialization
│   └── types/
│       └── index.ts             # TypeScript definitions
├── logs/                        # Application logs
└── README.md                    # This file
```

## 🆘 Support & Troubleshooting

### Using the Dashboard

1. Navigate to your deployment URL for the interactive dashboard
2. Use the built-in API documentation for testing
3. Check the status endpoint for service health

### Manual Debugging

1. Check the logs in `logs/` directory for detailed error information
2. Verify all environment variables are correctly set using `/api/status`
3. Test individual services using the detailed status endpoint
4. Check API rate limits and quotas for external services
5. Review error notifications sent to your configured email

### Common Issues

- **Configuration**: Use `GET /api/status?detailed=true` to verify all services
- **Notion**: Ensure page ID is correct and integration has proper permissions
- **Twitter**: Check API keys and rate limits in Twitter Developer Console
- **Email**: Verify email credentials and app passwords

For additional support, please create an issue in the repository.

---

**Note**: This service is designed for personal use and includes defensive security measures. It will not assist with any malicious activities.
