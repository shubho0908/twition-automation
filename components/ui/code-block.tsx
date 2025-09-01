"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  copyText?: string
  language?: string
}

const CodeBlock = React.forwardRef<
  HTMLPreElement,
  CodeBlockProps
>(({ className, children, copyText, language, ...props }, ref) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText || children?.toString() || "")
      toast.success("Copied to clipboard!")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="relative">
      <pre
        ref={ref}
        className={cn(
          "bg-slate-900 border border-slate-700 rounded-md p-4 text-sm font-mono overflow-x-auto max-w-full",
          className
        )}
        {...props}
      >
        {children}
      </pre>
      {copyText && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-400 hover:text-white cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"

export { CodeBlock }