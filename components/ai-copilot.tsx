"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/types"
import {
  Bot,
  ArrowRight,
  X,
  ChevronDown,
  Plus,
  Users,
  FileText,
  ArrowUpRight,
  Search,
  Sparkles,
  Lightbulb,
  BookOpen,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AICopilotProps {
  conversation: Conversation
  onSendMessage?: (message: string) => void
  initialQuery?: string | null
  isMobile?: boolean
  onClose?: () => void
}

export function AICopilot({ conversation, onSendMessage, initialQuery, isMobile = false, onClose }: AICopilotProps) {
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [aiArticles, setAiArticles] = useState<{ title: string; url: string }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("copilot")
  const inputRef = useRef<HTMLInputElement>(null)

  // State for expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState({
    links: true,
    userData: false,
    conversationAttributes: false,
    companyDetails: false,
    salesforce: false,
    stripe: false,
    jiraTickets: false,
  })

  // Process initial query if provided
  useEffect(() => {
    if (initialQuery) {
      setActiveTab("copilot")
      handleSuggestedQuestionClick(initialQuery)
    }
  }, [initialQuery])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSuggestedQuestionClick = (question: string) => {
    setIsProcessing(true)
    setAiResponse(null)
    setActiveTab("copilot") // Switch to copilot tab when question is clicked

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)

      if (question.toLowerCase().includes("refund") || question.toLowerCase().includes("return")) {
        setAiResponse(
          "Based on this conversation, the customer is asking about a refund for an order placed over 60 days ago. Here's what you can do:",
        )
        setAiSuggestions([
          "I understand your situation. While our policy is 60 days, I can make an exception in this case.",
          "I'll need your order number to process this exception refund.",
          "Could you confirm the item is still in its original packaging?",
        ])
        setAiArticles([
          { title: "Refund Policy", url: "#refund-policy" },
          { title: "Exception Handling", url: "#exceptions" },
        ])
      } else {
        setAiResponse(`Here's information about "${question}":`)
        setAiSuggestions([
          "I'd be happy to explain our policy on that.",
          "Let me check the details for you.",
          "I can help you with that request.",
        ])
        setAiArticles([
          { title: "Help Center Article", url: "#help-center" },
          { title: "Customer Support Guide", url: "#support-guide" },
        ])
      }
    }, 1500)
  }

  const handleSendSuggestion = (suggestion: string) => {
    if (onSendMessage) {
      onSendMessage(suggestion)

      // Simulate AI processing after sending suggestion
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setAiResponse("The customer might ask about processing time. Here's what you can say:")
        setAiSuggestions([
          "The refund should appear on your statement within 3-5 business days.",
          "Is there anything else I can help you with today?",
          "Would you like me to send you an email confirmation of this refund request?",
        ])
      }, 2000)
    }
  }

  const handleAskAI = () => {
    if (inputValue.trim()) {
      handleSuggestedQuestionClick(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAskAI()
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="w-full md:w-80 flex flex-col h-full bg-gray-50 dark:bg-slate-800 transition-all duration-300">
      <Tabs defaultValue="copilot" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
          <TabsList className="bg-transparent border-0 p-0 flex space-x-4">
            <TabsTrigger
              value="copilot"
              className="data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none px-0 py-1 rounded-none text-gray-500 dark:text-gray-400 font-medium"
            >
              <Bot className="h-4 w-4 mr-2" />
              Copilot
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none px-0 py-1 rounded-none text-gray-500 dark:text-gray-400 font-medium"
            >
              Details
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-3 ml-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close AI Copilot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <TabsContent value="copilot" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {!aiResponse && !isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center h-full"
              >
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-4 mb-4">
                  <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-1 dark:text-white">Hi, I'm Fin AI Copilot</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Ask me anything about this conversation.
                </p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="flex space-x-2 mb-4">
                  <motion.div
                    className="h-3 w-3 bg-indigo-400 dark:bg-indigo-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      times: [0, 0.5, 1],
                    }}
                  ></motion.div>
                  <motion.div
                    className="h-3 w-3 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.2,
                      times: [0, 0.5, 1],
                    }}
                  ></motion.div>
                  <motion.div
                    className="h-3 w-3 bg-indigo-600 dark:bg-indigo-300 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.4,
                      times: [0, 0.5, 1],
                    }}
                  ></motion.div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing conversation...</p>
              </motion.div>
            )}

            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-2">
                      <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-2 dark:text-white">{aiResponse}</p>

                      {aiSuggestions.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Suggested responses:</p>
                          {aiSuggestions.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              className="group"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                            >
                              <div
                                className="bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 rounded-lg p-2 text-sm cursor-pointer flex justify-between items-center transition-all duration-200"
                                onClick={() => handleSendSuggestion(suggestion)}
                              >
                                <span className="text-gray-800 dark:text-gray-200">{suggestion}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSendSuggestion(suggestion)
                                  }}
                                >
                                  <ArrowRight className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {aiArticles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Helpful resources:</p>
                          {aiArticles.map((article, index) => (
                            <motion.a
                              key={index}
                              href={article.url}
                              className="block bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 + 0.3 }}
                            >
                              <div className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-2" />
                                <span>{article.title}</span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        setAiResponse(null)
                        setAiSuggestions([])
                        setAiArticles([])
                      }}
                    >
                      <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!aiResponse && (
              <div className="mb-4 space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Suggested</p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 flex items-center"
                  onClick={() => handleSuggestedQuestionClick("How do I handle this refund exception request?")}
                >
                  <Lightbulb className="h-3 w-3 mr-2 text-amber-500" />
                  How do I handle this refund exception request?
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer transition-all duration-200 flex items-center"
                  onClick={() => handleSuggestedQuestionClick("What's our policy on refunds after 60 days?")}
                >
                  <Lightbulb className="h-3 w-3 mr-2 text-amber-500" />
                  What's our policy on refunds after 60 days?
                </motion.div>
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a question..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-md p-2 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleAskAI}
                disabled={!inputValue.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                  <Sparkles
                    className={`h-4 w-4 ${inputValue.trim() ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400"}`}
                  />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="details"
          className="flex-1 p-0 m-0 min-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
        >
          <div className="bg-gray-50 dark:bg-slate-800 h-full">
            {/* Assignee and Team sections */}
            <div className="px-5 py-4 space-y-5 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-center">
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Assignee</div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                  <span className="text-sm font-medium dark:text-white">Brian Byrne</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Team</div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium dark:text-white">Unassigned</span>
                </div>
              </div>
            </div>

            {/* Collapsible sections */}
            <div className="mt-2">
              {/* LINKS Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("links")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">LINKS</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.links ? "transform rotate-180" : ""}`}
                  />
                </div>

                {expandedSections.links && (
                  <div className="px-5 pb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                        <span className="text-sm dark:text-white">Tracker ticket</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                        <span className="text-sm dark:text-white">Back-office tickets</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-3 text-gray-700 dark:text-gray-300" />
                        <span className="text-sm dark:text-white">Side conversations</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* USER DATA Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("userData")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">USER DATA</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.userData ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* CONVERSATION ATTRIBUTES Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("conversationAttributes")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">CONVERSATION ATTRIBUTES</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.conversationAttributes ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* COMPANY DETAILS Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("companyDetails")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">COMPANY DETAILS</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.companyDetails ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* SALESFORCE Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("salesforce")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">SALESFORCE</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.salesforce ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* STRIPE Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("stripe")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">STRIPE</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.stripe ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* JIRA FOR TICKETS Section */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center justify-between px-5 py-3 cursor-pointer"
                  onClick={() => toggleSection("jiraTickets")}
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">JIRA FOR TICKETS</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedSections.jiraTickets ? "transform rotate-180" : ""}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
