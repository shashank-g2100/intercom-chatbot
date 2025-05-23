"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Conversation, Message } from "@/types"
import {
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Bot,
  Star,
  Phone,
  Clock,
  UserPlus,
  ImageIcon,
  File,
  Mic,
  Video,
  CheckCheck,
  Maximize2,
  Minimize2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface ChatInterfaceProps {
  conversation: Conversation
  onAskAICopilot?: (message: string) => void
  onClose?: () => void
  onToggleAI?: () => void
  isMobile?: boolean
}

export function ChatInterface({
  conversation,
  onAskAICopilot,
  onClose,
  onToggleAI,
  isMobile = false,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [isStarred, setIsStarred] = useState(false)
  const [isSnoozed, setIsSnoozed] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Sample messages for the active conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "system",
      content: "Thanks, passing you to the right team now.",
      timestamp: new Date(Date.now() - 60000 * 22),
      hasBot: true,
    },
    {
      id: "2",
      sender: "agent",
      content: "Let me just look into this for you, Nikola.",
      timestamp: new Date(Date.now() - 60000 * 20),
    },
    {
      id: "3",
      sender: "agent",
      content:
        "We understand if your purchase didn't quite meet your expectations. To help you with a refund, please provide your order ID and proof of purchase.\n\nJust a heads-up:\nWe can only refund orders from the last 60 days.\nYour item must meet our return condition requirements.\n\nOnce confirmed, I'll send you a returns QR code for easy processing.\n\nThanks for your cooperation!",
      timestamp: new Date(Date.now() - 60000 * 21),
      seen: true,
    },
    {
      id: "4",
      sender: "user",
      content: "I placed the order over 60 days ago 😔. Could you make an exception, please?",
      timestamp: new Date(Date.now() - 60000 * 21),
    },
  ])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const handleStarConversation = () => {
    setIsStarred(!isStarred)
  }

  const handleSnooze = () => {
    setIsSnoozed(!isSnoozed)
  }

  const handleFileUpload = (type: string) => {
    setShowAttachmentOptions(false)
    if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      // Simulate file selection for other types
      const fileTypes: Record<string, string> = {
        image: "image.jpg",
        audio: "audio.mp3",
        video: "video.mp4",
      }

      const fileName = fileTypes[type] || "file.pdf"

      // Add a system message about the file
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "agent",
        content: `Attached ${fileName}`,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Add a system message about the file
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "agent",
        content: `Attached ${file.name}`,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "agent",
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue("")

      // Simulate user typing
      setIsTyping(true)

      // Simulate user reply after a delay
      setTimeout(() => {
        setIsTyping(false)
        const userReply: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: "user",
          content: "Thank you! When can I expect the refund to be processed?",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userReply])
      }, 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMessageClick = (messageId: string) => {
    if (selectedMessageId === messageId) {
      setSelectedMessageId(null)
    } else {
      setSelectedMessageId(messageId)
    }
  }

  // Sample emojis for the emoji picker
  const emojiCategories = [
    {
      name: "Frequently Used",
      emojis: ["😊", "👍", "🙏", "❤️", "😂", "🎉", "👋", "🤔", "😔", "🙂"],
    },
    {
      name: "Smileys",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"],
    },
    {
      name: "Gestures",
      emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤝", "🙌", "👏", "🤲", "🙏"],
    },
    {
      name: "Love",
      emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💕", "💓", "💗"],
    },
  ]

  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0)

  return (
    <div
      className={`flex-1 flex flex-col h-full border-r border-gray-200 dark:border-gray-800 ${isExpanded ? "fixed inset-0 z-50 bg-white dark:bg-slate-900" : ""}`}
    >
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileInputChange} />

      {/* Header */}
      {!isMobile && (
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 transition-all duration-300">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white mr-2">
              {conversation.user.initial}
            </div>
            <div>
              <h2 className="text-md font-semibold dark:text-white">{conversation.user.name}</h2>
              {conversation.user.company && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.user.company}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${isStarred ? "text-amber-500" : ""}`}
                    onClick={handleStarConversation}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isStarred ? "Unstar conversation" : "Star conversation"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <span className="mr-2">📝</span> Mark as unread
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">📌</span> Add note
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">🏷️</span> Add tag
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="mr-2">🚫</span> Block user
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <span className="mr-2">🗑️</span> Delete conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assign conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="mr-2">👥</span> Add team member
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">🔄</span> Transfer to another team
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">👨‍💼</span> Assign to support agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md transition-all duration-200"
                    onClick={() => {
                      const newMessage: Message = {
                        id: `msg-${Date.now()}`,
                        sender: "system",
                        content: "Call initiated with Nikola Tesla",
                        timestamp: new Date(),
                      }
                      setMessages([...messages, newMessage])
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start a call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSnoozed ? "default" : "outline"}
                    size="sm"
                    className={`h-8 rounded-md transition-all duration-200 ${isSnoozed ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                    onClick={handleSnooze}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {isSnoozed ? "Snoozed" : "Snooze"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSnoozed ? "Unsnoozed conversation" : "Snooze conversation"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isExpanded ? "Exit fullscreen" : "Fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleAI}>
                    <Bot className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle AI Copilot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 rounded-md bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        <div className="w-full h-1 border-b border-gray-200 dark:border-gray-800 my-4"></div>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              message.sender === "user"
                ? "justify-start"
                : message.sender === "notification"
                  ? "justify-center"
                  : "justify-end"
            }`}
          >
            {message.sender === "user" && (
              <div className="mr-2 mt-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white">
                  N
                </div>
              </div>
            )}

            <div className="flex flex-col max-w-[70%]">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-lg ${
                  message.sender === "user"
                    ? `bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${selectedMessageId === message.id ? "ring-2 ring-indigo-400" : ""}`
                    : message.sender === "notification"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-gray-800 dark:text-gray-200 px-4 py-2"
                      : "bg-indigo-100 dark:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                } ${message.sender === "user" ? "cursor-pointer" : ""} shadow-sm`}
                onClick={() => message.sender === "user" && handleMessageClick(message.id)}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-end items-center">
                  {message.seen && (
                    <span className="mr-1 flex items-center">
                      <CheckCheck className="h-3 w-3 mr-1 text-indigo-500" /> Seen •
                    </span>
                  )}
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {message.hasBot && (
                    <div className="ml-1 bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>

              {selectedMessageId === message.id && message.sender === "user" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 flex space-x-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAskAICopilot && onAskAICopilot(message.content)
                      setSelectedMessageId(null)
                    }}
                  >
                    <Bot className="h-3 w-3 mr-1 text-indigo-500" />
                    Ask AI Copilot
                  </Button>
                </motion.div>
              )}
            </div>

            {message.sender === "agent" && message.seen && (
              <div className="ml-2 mt-1">
                <Avatar className="h-8 w-8 ring-2 ring-indigo-100 dark:ring-indigo-900">
                  <img src="/placeholder.svg?height=32&width=32" alt="Agent" className="rounded-full" />
                </Avatar>
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="mr-2 mt-1">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white">
                N
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                ></motion.div>
                <motion.div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 transition-all duration-300">
        <div className="flex items-center">
          <div className="flex-1 flex items-center border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-slate-800 shadow-sm transition-all duration-300">
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-l-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add attachment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <AnimatePresence>
                {showAttachmentOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-2 z-10"
                  >
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handleFileUpload("image")}
                      >
                        <ImageIcon className="h-4 w-4 mr-2 text-indigo-500" />
                        <span>Image</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handleFileUpload("file")}
                      >
                        <File className="h-4 w-4 mr-2 text-indigo-500" />
                        <span>File</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handleFileUpload("audio")}
                      >
                        <Mic className="h-4 w-4 mr-2 text-indigo-500" />
                        <span>Audio</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handleFileUpload("video")}
                      >
                        <Video className="h-4 w-4 mr-2 text-indigo-500" />
                        <span>Video</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <textarea
                ref={inputRef}
                className="w-full border-0 rounded-none p-2 text-sm resize-none focus:outline-none focus:ring-0 bg-transparent dark:text-white"
                placeholder="Type your message..."
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ maxHeight: "120px", minHeight: "24px" }}
              />
            </div>

            <div className="flex items-center">
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-3 z-10 w-64"
                    >
                      <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 overflow-x-auto scrollbar-hide">
                        {emojiCategories.map((category, idx) => (
                          <button
                            key={idx}
                            className={`px-3 py-1 text-sm whitespace-nowrap ${
                              activeEmojiCategory === idx
                                ? "bg-gray-100 dark:bg-gray-700 rounded-md font-medium"
                                : "text-gray-600 dark:text-gray-400"
                            } transition-colors duration-200`}
                            onClick={() => setActiveEmojiCategory(idx)}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {emojiCategories[activeEmojiCategory].emojis.map((emoji, index) => (
                          <button
                            key={index}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg transition-colors duration-200"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        Click an emoji to add it to your message
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-r-md ${
                        inputValue.trim()
                          ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          : "text-gray-500 dark:text-gray-400"
                      } transition-colors duration-200`}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2 flex items-center">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-[10px] mr-1.5">
            ⌘K
          </span>
          for shortcuts
        </div>
      </div>
    </div>
  )
}
