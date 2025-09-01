import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Twition - Documentation",
  description: "Twition - Simple one-endpoint API for automating Twitter posts from Notion tasks using AI. Integrates Notion, Google Gemini AI, and Twitter APIs for seamless content creation.",
  keywords: [
    "Twition",
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
  authors: [{ name: "Twition" }],
  creator: "Twition",
  publisher: "Twition",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Twition - Documentation",
    description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI",
    type: "website",
    locale: "en_US",
    siteName: "Twition",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twition - Documentation",
    description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI",
    creator: "@twition_api",
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
    name: 'Twition',
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
      name: 'Twition'
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
      <Card className="min-h-screen rounded-none border-none">
        <Card className="rounded-none border-b">
          <CardContent className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Twition</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Simple, elegant automation</p>
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
          </CardContent>
        </Card>

        <CardContent className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-3">
                  <Link href="#overview" className="block text-sm text-primary hover:text-primary/80 font-medium">
                    What does this do?
                  </Link>
                  <Link href="#authentication" className="block text-sm text-muted-foreground hover:text-foreground font-medium">
                    Setup
                  </Link>
                  <Link href="#endpoints" className="block text-sm text-muted-foreground hover:text-foreground font-medium">
                    API Endpoints
                  </Link>
                  <Link href="#examples" className="block text-sm text-muted-foreground hover:text-foreground font-medium">
                    Ways to use it
                  </Link>
                  <Link href="#errors" className="block text-sm text-muted-foreground hover:text-foreground font-medium">
                    When things go wrong
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <Card id="overview">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">What does this do?</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Transform your Notion tasks into Twitter posts automatically. 
                  One button click reads your completed tasks, creates engaging content with AI, and posts to Twitter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">How it works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between space-x-6">
                      <Card className="text-center p-4">
                        <CardContent className="p-0">
                          <Badge variant="outline" className="w-12 h-12 rounded-full mb-2 bg-blue-100 dark:bg-blue-900 border-blue-300">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
                          </Badge>
                          <p className="text-sm">Read Notion</p>
                        </CardContent>
                      </Card>
                      <Separator className="flex-1" />
                      <Card className="text-center p-4">
                        <CardContent className="p-0">
                          <Badge variant="outline" className="w-12 h-12 rounded-full mb-2 bg-green-100 dark:bg-green-900 border-green-300">
                            <span className="text-green-600 dark:text-green-400 font-medium">2</span>
                          </Badge>
                          <p className="text-sm">Generate Content</p>
                        </CardContent>
                      </Card>
                      <Separator className="flex-1" />
                      <Card className="text-center p-4">
                        <CardContent className="p-0">
                          <Badge variant="outline" className="w-12 h-12 rounded-full mb-2 bg-purple-100 dark:bg-purple-900 border-purple-300">
                            <span className="text-purple-600 dark:text-purple-400 font-medium">3</span>
                          </Badge>
                          <p className="text-sm">Post to Twitter</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

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
                <CardTitle className="text-2xl font-bold">Setup</CardTitle>
                <CardDescription>
                  Configure your API keys once. No authentication needed in requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <CardTitle className="font-medium text-lg">You need these API keys:</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-medium text-base">Notion API Key</CardTitle>
                        <CardDescription className="font-medium">Get from developers.notion.com</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-medium text-base">Twitter API Keys</CardTitle>
                        <CardDescription className="font-medium">Get from developer.twitter.com</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-medium text-base">Gemini AI Key</CardTitle>
                        <CardDescription className="font-medium">Get from ai.google.dev</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-medium text-base">Email Settings</CardTitle>
                        <CardDescription className="font-medium">For notifications</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">✓ Environment Validation</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="font-medium text-green-700 dark:text-green-300">
                      The API automatically validates all required environment variables on startup and provides detailed error messages for missing configurations.
                    </CardDescription>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card id="endpoints">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">API Endpoints</CardTitle>
                <CardDescription>Just two simple endpoints</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

              {/* POST /api/automate */}
              <Card id="post-automate">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      POST
                    </Badge>
                    <CardTitle className="text-lg font-medium">/api/automate</CardTitle>
                  </div>
                  <CardDescription className="font-medium">
                    This does everything: reads your Notion tasks, creates Twitter content with AI, and posts it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">How to use it</h4>
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
                    <CardTitle className="text-lg font-medium">/api/automate</CardTitle>
                  </div>
                  <CardDescription className="font-medium">
                    Check if the API is working.
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
                    <CardTitle className="text-lg font-medium">/api/status</CardTitle>
                  </div>
                  <CardDescription className="font-medium">
                    See detailed system health and connection status.
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
              </CardContent>
            </Card>

            {/* Examples Section */}
            <Card id="examples">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Ways to use it</CardTitle>
                <CardDescription>Pick what works best for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔘 Notion Button (Easiest)</h3>
                  <Card className="bg-muted">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-2">Add a button to your Notion page:</p>
                      <ul className="text-sm space-y-1">
                        <li>1. Type <code className="bg-background px-1 rounded">/button</code> in Notion</li>
                        <li>2. Set URL to: <code className="bg-background px-1 rounded text-xs">{baseUrl}/api/automate</code></li>
                        <li>3. Set Method to: <code className="bg-background px-1 rounded">POST</code></li>
                        <li>4. Click the button to post your completed tasks!</li>
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
                  <h3 className="text-lg font-semibold mb-3">🔗 Command Line</h3>
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
                <CardTitle className="text-2xl font-bold">When things go wrong</CardTitle>
                <CardDescription>Common error messages and what they mean</CardDescription>
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
        </CardContent>
      </Card>
    </>
  );
}