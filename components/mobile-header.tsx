"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Bot, X } from "lucide-react"
import type { Conversation } from "@/types"

interface MobileHeaderProps {
  view: "list" | "chat" | "ai"
  onBack: () => void
  conversation: Conversation | null
  onToggleAI: () => void
}

export function MobileHeader({ view, onBack, conversation, onToggleAI }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
      {view === "list" ? (
        <h1 className="text-lg font-semibold dark:text-white">Inbox</h1>
      ) : (
        <>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {conversation && (
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-2">
                  {conversation.user.initial}
                </div>
                <h2 className="text-md font-medium dark:text-white">{conversation.user.name}</h2>
                {conversation.user.company && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">· {conversation.user.company}</span>
                )}
              </div>
            )}
          </div>
          <Button
            variant={view === "ai" ? "default" : "outline"}
            size="icon"
            onClick={onToggleAI}
            className={view === "ai" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            {view === "ai" ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </Button>
        </>
      )}
    </div>
  )
}
