"use client"

import { ChevronDown, Search, Star, Clock, InboxIcon } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Conversation } from "@/types"
import { motion } from "framer-motion"

interface ConversationListProps {
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
}

export function ConversationList({ conversations, activeConversationId, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const filters = [
    { id: "all", label: "All", icon: InboxIcon },
    { id: "unread", label: "Unread", icon: InboxIcon },
    { id: "priority", label: "Priority", icon: Star },
    { id: "snoozed", label: "Snoozed", icon: Clock },
  ]

  const filteredConversations = conversations.filter((conversation) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.user.company && conversation.user.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conversation.preview.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply category filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && conversation.unread) ||
      (activeFilter === "priority" && conversation.priority)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="w-full h-full border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-slate-900 transition-all duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Your inbox</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-800">
        <div className="flex p-2 space-x-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={`text-xs ${activeFilter === filter.id ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "text-gray-600 dark:text-gray-300"}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <filter.icon className="h-3 w-3 mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{filteredConversations.length} Conversations</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="ml-auto flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Waiting longest</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
            <InboxIcon className="h-8 w-8 mb-2 opacity-50" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors duration-200 ${
                activeConversationId === conversation.id ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
              }`}
              onClick={() => {
                onSelectConversation(conversation)
              }}
            >
              <div className="flex items-start">
                <div className="relative">
                  <Avatar
                    className={`h-10 w-10 ${conversation.unread ? "ring-2 ring-indigo-500 dark:ring-indigo-400" : ""}`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full ${conversation.priority ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-gradient-to-br from-teal-400 to-teal-600"} text-white flex items-center justify-center font-medium`}
                    >
                      {conversation.user.initial}
                    </div>
                  </Avatar>
                  {conversation.user.isBot && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-white text-[8px]">B</span>
                    </div>
                  )}
                  {conversation.priority && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                      <span className="text-white text-[8px]">!</span>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center">
                      {conversation.user.name}
                      {conversation.user.company && (
                        <span className="text-gray-500 dark:text-gray-400 ml-1 text-xs">
                          · {conversation.user.company}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{conversation.time}</div>
                  </div>
                  <p
                    className={`text-sm ${conversation.unread ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-500 dark:text-gray-400"} truncate mt-1`}
                  >
                    {conversation.preview}
                  </p>
                  {conversation.subtext && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">{conversation.subtext}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
