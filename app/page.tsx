import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Twitter Automation API - Documentation",
  description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI. Integrates Notion, Google Gemini AI, and Twitter APIs for seamless content creation.",
  keywords: [
    "Twitter API", 
    "Notion integration", 
    "AI automation", 
    "Gemini AI", 
    "Twitter bot", 
    "Content automation", 
    "Social media automation",
    "REST API",
    "Next.js API"
  ],
  authors: [{ name: "Twitter Automation API" }],
  creator: "Twitter Automation API",
  publisher: "Twitter Automation API",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Twitter Automation API - Documentation",
    description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI",
    type: "website",
    locale: "en_US",
    siteName: "Twitter Automation API",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter Automation API - Documentation",
    description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI",
    creator: "@twitter_automation_api",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  verification: {
    // Add verification meta tags here if needed
    // google: "your-google-site-verification",
    // other: "your-other-verification-codes",
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
}

export default function Home() {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_BASE_URL;
  };

  const baseUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Twitter Automation API',
    description: 'Simple one-endpoint API for automating Twitter posts from Notion tasks using AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Organization',
      name: 'Twitter Automation API'
    },
    featureList: [
      'Notion Integration',
      'AI Content Generation',
      'Twitter Posting',
      'Email Notifications',
      'One-Click Automation'
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Twitter Automation API</h1>
              </div>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Base URL:</span>
              <code className="bg-muted px-3 py-1 rounded text-sm font-mono">
                {baseUrl}
              </code>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-primary hover:text-primary/80 font-medium">
                    Overview
                  </a>
                  <a href="#authentication" className="block text-sm text-muted-foreground hover:text-foreground">
                    Authentication
                  </a>
                  <a href="#endpoints" className="block text-sm text-muted-foreground hover:text-foreground">
                    Endpoints
                  </a>
                  <div className="ml-4 space-y-1">
                    <a href="#post-automate" className="block text-xs text-muted-foreground hover:text-foreground">
                      POST /api/automate
                    </a>
                    <a href="#get-automate" className="block text-xs text-muted-foreground hover:text-foreground">
                      GET /api/automate
                    </a>
                    <a href="#get-status" className="block text-xs text-muted-foreground hover:text-foreground">
                      GET /api/status
                    </a>
                  </div>
                  <a href="#examples" className="block text-sm text-muted-foreground hover:text-foreground">
                    Examples
                  </a>
                  <a href="#errors" className="block text-sm text-muted-foreground hover:text-foreground">
                    Error Codes
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <Card id="overview">
              <CardHeader>
                <CardTitle className="text-2xl">Overview</CardTitle>
                <CardDescription>
                  The Twitter Automation API provides a modern, comprehensive solution for automating Twitter posts from your Notion tasks. 
                  Built with Next.js 15, React 19, and enhanced error handling, it integrates seamlessly with Notion, Google Gemini AI, and Twitter APIs to create and publish engaging content automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">🚀 One-Click Automation</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Send a single POST request to fetch Notion tasks, generate AI content, and post to Twitter automatically.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                    <CardContent className="pt-4">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✨ Enhanced Error Handling</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Comprehensive error tracking, notifications, and recovery with stage-based monitoring.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">2</div>
                      <div className="text-sm font-medium">Endpoints</div>
                      <div className="text-xs text-muted-foreground">Automate + Status</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">4</div>
                      <div className="text-sm font-medium">Services</div>
                      <div className="text-xs text-muted-foreground">Notion + AI + Twitter + Email</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">∞</div>
                      <div className="text-sm font-medium">Reliability</div>
                      <div className="text-xs text-muted-foreground">Enhanced monitoring</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Section */}
            <Card id="authentication">
              <CardHeader>
                <CardTitle className="text-2xl">Authentication & Configuration</CardTitle>
                <CardDescription>
                  This API uses environment-based authentication with comprehensive validation. No API keys are required in requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                  <CardContent className="pt-4">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">📋 Required Environment Variables</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">NOTION_API_KEY</code> - Notion integration key</div>
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">NOTION_PAGE_ID</code> - Default page/database ID</div>
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">TWITTER_API_KEY</code> - Twitter API credentials</div>
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">TWITTER_ACCESS_TOKEN</code> - Twitter access token</div>
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">GEMINI_API_KEY</code> - Google Gemini AI key</div>
                      <div>• <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">EMAIL_USER</code> - Email service credentials</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CardContent className="pt-4">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✓ Environment Validation</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      The API automatically validates all required environment variables on startup and provides detailed error messages for missing configurations.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Endpoints Section */}
            <div id="endpoints" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">API Endpoints</h2>
                <Separator />
              </div>

              {/* POST /api/automate */}
              <Card id="post-automate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      POST
                    </Badge>
                    <CardTitle className="text-lg">/api/automate</CardTitle>
                  </div>
                  <CardDescription>
                    Triggers the complete automation workflow: fetches Notion tasks, generates AI content, and posts to Twitter.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Request Options</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4 space-y-2">
                        <div className="font-mono text-sm text-green-400"># Basic automation</div>
                        <div className="font-mono text-sm text-white">curl -X POST {baseUrl}/api/automate</div>
                        <div className="font-mono text-sm text-green-400"># With specific Notion page</div>
                        <div className="font-mono text-sm text-white">curl -X POST &quot;{baseUrl}/api/automate?pageId=your-page-id&quot;</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Success Response (200)</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4">
                        <pre className="text-green-400 text-sm font-mono">{`{
  "success": true,
  "message": "Successfully posted 2 tweet(s) from 3 completed task(s)",
  "data": {
    "tasks": {
      "count": 3,
      "titles": ["Task 1", "Task 2", "Task 3"]
    },
    "content": {
      "type": "thread",
      "tweets": 2
    },
    "twitter": {
      "tweetIds": ["123456789", "987654321"],
      "success": true
    },
    "timing": {
      "startTime": "2024-01-15T10:30:00Z",
      "endTime": "2024-01-15T10:30:05Z",
      "duration": "5000ms"
    }
  },
  "metadata": {
    "stage": "completed",
    "source": "unified-automation-endpoint",
    "version": "1.0.0"
  }
}`}</pre>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">No Tasks Response (200)</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4">
                        <pre className="text-yellow-400 text-sm font-mono">{`{
  "success": true,
  "message": "No completed tasks found for today",
  "action": "skipped",
  "tasks": []
}`}</pre>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Error Response (500)</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4">
                        <pre className="text-red-400 text-sm font-mono">{`{
  "success": false,
  "message": "Automation workflow failed",
  "error": {
    "message": "Twitter API rate limit exceeded",
    "stage": "twitter-posting",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "debug": {
    "startTime": "2024-01-15T10:29:55Z",
    "failedAt": "2024-01-15T10:30:00Z",
    "stage": "twitter-posting"
  }
}`}</pre>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* GET /api/automate */}
              <Card id="get-automate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      GET
                    </Badge>
                    <CardTitle className="text-lg">/api/automate</CardTitle>
                  </div>
                  <CardDescription>
                    Quick health check endpoint to verify the API is running and accessible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Request</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4 font-mono text-sm text-green-400">
                        curl {baseUrl}/api/automate
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Response (200)</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4">
                        <pre className="text-green-400 text-sm font-mono">{`{
  "status": "ready",
  "message": "Unified automation endpoint is ready",
  "configuration": {
    "environment": "valid"
  },
  "endpoints": {
    "trigger": "POST /api/automate",
    "health": "GET /api/automate"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}</pre>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* GET /api/status */}
              <Card id="get-status">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      GET
                    </Badge>
                    <CardTitle className="text-lg">/api/status</CardTitle>
                  </div>
                  <CardDescription>
                    Comprehensive system status check including all service connections and health metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Request</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4 font-mono text-sm text-green-400">
                        curl {baseUrl}/api/status?detailed=true
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Response (200)</h4>
                    <Card className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-4">
                        <pre className="text-green-400 text-sm font-mono">{`{
  "status": "healthy",
  "service": "twitter-automation",
  "timestamp": "2024-01-15T10:30:00Z",
  "integrations": {
    "notion": {
      "status": "healthy",
      "connected": true,
      "description": "Notion database connection for task retrieval"
    },
    "twitter": {
      "status": "healthy", 
      "connected": true,
      "description": "Twitter API connection for posting tweets"
    },
    "email": {
      "status": "healthy",
      "connected": true,
      "description": "Email service for error and success notifications"
    },
    "gemini": {
      "status": "configured",
      "connected": true,
      "description": "Google Gemini AI for content generation"
    }
  },
  "errorHandling": {
    "initialized": true,
    "globalErrorHandlers": "active",
    "emailNotifications": "enabled",
    "features": [
      "Retry mechanism with exponential backoff",
      "Detailed error context and stack traces",
      "Stage-based error tracking"
    ]
  },
  "overall": {
    "status": "healthy",
    "allServicesHealthy": true,
    "message": "All systems operational with enhanced error handling"
  }
}`}</pre>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Examples Section */}
            <Card id="examples">
              <CardHeader>
                <CardTitle className="text-2xl">Integration Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔘 Notion Button</h3>
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Create a button in your Notion page:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Type <code className="bg-background px-1 rounded">{`/button`}</code> in Notion</li>
                        <li>URL: <code className="bg-background px-1 rounded">{baseUrl}/api/automate</code></li>
                        <li>Method: <code className="bg-background px-1 rounded">POST</code></li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">📱 JavaScript/Fetch</h3>
                  <Card className="bg-slate-900 border-slate-700">
                    <CardContent className="pt-4">
                      <pre className="text-green-400 text-sm font-mono">{`fetch('/api/automate', {
  method: 'POST'
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</pre>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">🔗 cURL Command</h3>
                  <Card className="bg-slate-900 border-slate-700">
                    <CardContent className="pt-4">
                      <pre className="text-green-400 text-sm font-mono">curl -X POST {baseUrl}/api/automate</pre>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Error Codes Section */}
            <Card id="errors">
              <CardHeader>
                <CardTitle className="text-2xl">Error Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status Code</TableHead>
                      <TableHead>Error Stage</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">500</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">environment-validation</TableCell>
                      <TableCell>Missing required environment variables</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">500</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">notion-fetch</TableCell>
                      <TableCell>Failed to connect to Notion API or fetch tasks</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">500</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">gemini-generation</TableCell>
                      <TableCell>AI content generation failed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">500</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">twitter-posting</TableCell>
                      <TableCell>Twitter API error or rate limit exceeded</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="default" className="font-mono bg-green-100 text-green-800 hover:bg-green-100">200</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">success</TableCell>
                      <TableCell>Automation completed successfully</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}