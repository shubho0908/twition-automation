"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { toast } from "sonner"

export default function Home() {
  const [pageId, setPageId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlPageId = urlParams.get('pageId')
    if (urlPageId) {
      setPageId(urlPageId)
    }
  }, [])

  const handleTrigger = async () => {
    setIsLoading(true)
    setResponse(null)
    
    const toastId = toast.loading("Starting automation process...")
    
    try {
      toast.loading("Reading Notion tasks...", { id: toastId })
      
      const url = `/api/automate?pageId=${encodeURIComponent(pageId)}`
      
      const res = await fetch(url, {
        method: "POST",
      })
      
      toast.loading("Generating content with AI...", { id: toastId })
      
      const data = await res.json()
      setResponse(data)
      
      if (data.success) {
        toast.success(data.message || "Automation completed successfully!", { id: toastId })
      } else {
        toast.error(data.message || "Automation failed", { id: toastId })
      }
    } catch (error) {
      const errorResponse = {
        success: false,
        message: "Request failed",
        error: error instanceof Error ? error.message : "Unknown error"
      }
      setResponse(errorResponse)
      toast.error("Request failed", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="min-h-screen rounded-none border-none">
      <Header />

      <CardContent className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <Card>
            <CardHeader className="text-center px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold">Trigger Automation</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Transform your Notion tasks into Twitter posts with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <label htmlFor="pageId" className="text-sm font-medium block">
                  Page ID
                </label>
                <Input
                  id="pageId"
                  type="text"
                  placeholder="Enter Notion page ID"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  required
                  className="mt-2 sm:mt-3 text-sm sm:text-base"
                />
              </div>

              <Button 
                onClick={handleTrigger} 
                disabled={isLoading || !pageId.trim()}
                className="w-full text-sm sm:text-base cursor-pointer"
                size="lg"
              >
                {isLoading ? "Processing..." : "Trigger Automation"}
              </Button>

              {response && (
                <Card className={response.success ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"}>
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle className={`text-sm font-medium ${response.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                      {response.success ? "✓ Success" : "✗ Error"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <pre className={`text-xs sm:text-sm font-mono overflow-auto ${response.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">1</div>
                  <div className="text-xs sm:text-sm font-medium">Read Notion</div>
                  <div className="text-xs text-muted-foreground">Fetch completed tasks</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">2</div>
                  <div className="text-xs sm:text-sm font-medium">Generate Content</div>
                  <div className="text-xs text-muted-foreground">AI-powered tweets</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">3</div>
                  <div className="text-xs sm:text-sm font-medium">Post to Twitter</div>
                  <div className="text-xs text-muted-foreground">Automatic publishing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}