"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

interface HeaderProps {
  showBackLink?: boolean
  showBaseUrl?: boolean
  baseUrl?: string
}

export function Header({ showBackLink = false, showBaseUrl = false, baseUrl }: HeaderProps) {
  return (
    <Card className="rounded-none border-b">
      <CardContent className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 sm:py-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              {showBackLink ? (
                <Link href="/" className="cursor-pointer">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Twition</h1>
                </Link>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Twition</h1>
              )}
              <Badge variant="secondary" className="text-xs">v1.0.0</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Simple, elegant automation</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
            {showBaseUrl && baseUrl && (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Base URL:</span>
                <code className="bg-muted px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-mono break-all">
                  {baseUrl}
                </code>
              </div>
            )}
            <div className="flex items-center gap-3 sm:gap-4">
              {!showBackLink && (
                <Link href="/docs" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  Documentation
                </Link>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}