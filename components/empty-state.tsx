"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export function EmptyState({ title, description, buttonText, onButtonClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-gray-50 dark:bg-slate-900 transition-all duration-300">
      <div className="text-center p-8 max-w-md">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        {buttonText && onButtonClick && (
          <Button
            onClick={onButtonClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}
