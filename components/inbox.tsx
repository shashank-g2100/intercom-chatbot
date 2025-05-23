"use client"

import { useState, useEffect } from "react"
import { ConversationList } from "@/components/conversation-list"
import { ChatInterface } from "@/components/chat-interface"
import { AICopilot } from "@/components/ai-copilot"
import { EmptyState } from "@/components/empty-state"
import { MobileHeader } from "@/components/mobile-header"
import { useMobile } from "@/hooks/use-mobile"
import type { Conversation } from "@/types"
import { AnimatePresence, motion } from "framer-motion"

export function Inbox() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [aiCopilotQuery, setAiCopilotQuery] = useState<string | null>(null)
  const [isChatClosed, setIsChatClosed] = useState(false)
  const [showAICopilot, setShowAICopilot] = useState(true)
  const isMobile = useMobile()
  const [mobileView, setMobileView] = useState<"list" | "chat" | "ai">("list")

  const conversations: Conversation[] = [
    {
      id: "1",
      user: {
        name: "Luis",
        company: "Github",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "L",
      },
      preview: "Hey! I have a question about refunds for an order I placed over 60 days ago.",
      time: "45m",
      unread: false,
    },
    {
      id: "2",
      user: {
        name: "Ivan",
        company: "Nike",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "I",
      },
      preview: "Hi there, I have a question about my recent purchase. The item arrived damaged.",
      time: "30m",
      unread: true,
      priority: true,
    },
    {
      id: "3",
      user: {
        name: "Lead from New York",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "L",
      },
      preview: "Good morning, let me know about your enterprise pricing options.",
      time: "45m",
      unread: false,
    },
    {
      id: "4",
      user: {
        name: "Booking API problems",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "B",
        isBot: true,
      },
      preview: "Bug report: The booking API is returning 500 errors intermittently.",
      subtext: "Luis · Small Crafts",
      time: "45m",
      unread: false,
    },
    {
      id: "5",
      user: {
        name: "Miracle",
        company: "Exemplary Bank",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "M",
      },
      preview: "Hey there, I'm here to discuss the integration options for our banking system.",
      time: "48m",
      unread: false,
    },
  ]

  // Set the active conversation to the first one if none is selected
  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0])
    }
  }, [activeConversation, conversations])

  const handleAskAICopilot = (message: string) => {
    setAiCopilotQuery(message)
    if (isMobile) {
      setMobileView("ai")
    }
  }

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message)
    // In a real app, this would update the chat interface
  }

  const handleCloseConversation = () => {
    setIsChatClosed(true)
    if (isMobile) {
      setMobileView("list")
    }
  }

  const handleReopenChat = () => {
    setIsChatClosed(false)
    if (isMobile) {
      setMobileView("chat")
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setIsChatClosed(false)
    if (isMobile) {
      setMobileView("chat")
    }
  }

  const toggleAICopilot = () => {
    setShowAICopilot(!showAICopilot)
  }

  const closeAICopilot = () => {
    setShowAICopilot(false)
  }

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden rounded-lg shadow-xl bg-white dark:bg-slate-900 transition-all duration-300">
      {isMobile && (
        <MobileHeader
          view={mobileView}
          onBack={() => setMobileView("list")}
          conversation={activeConversation}
          onToggleAI={() => setMobileView(mobileView === "ai" ? "chat" : "ai")}
        />
      )}

      <div className="flex h-full">
        <AnimatePresence mode="wait">
          {(!isMobile || mobileView === "list") && (
            <motion.div
              key="conversation-list"
              initial={isMobile ? { x: -300, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: -300, opacity: 0 } : undefined}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${isMobile ? "w-full" : "w-80"}`}
            >
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?.id}
                onSelectConversation={handleSelectConversation}
              />
            </motion.div>
          )}

          {(!isMobile || mobileView === "chat") && activeConversation && (
            <motion.div
              key="chat-interface"
              initial={isMobile ? { x: 300, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: 300, opacity: 0 } : undefined}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${isMobile ? "w-full" : showAICopilot ? "flex-1" : "flex-1"}`}
            >
              {!isChatClosed ? (
                <ChatInterface
                  conversation={activeConversation}
                  onAskAICopilot={handleAskAICopilot}
                  onClose={handleCloseConversation}
                  onToggleAI={toggleAICopilot}
                  isMobile={isMobile}
                />
              ) : (
                <EmptyState
                  title="Chat closed"
                  description="This conversation has been closed"
                  buttonText="Reopen chat"
                  onButtonClick={handleReopenChat}
                />
              )}
            </motion.div>
          )}

          {(!isMobile || mobileView === "ai") && activeConversation && showAICopilot && (
            <motion.div
              key="ai-copilot"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${isMobile ? "w-full" : "w-80"}`}
            >
              <AICopilot
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
                initialQuery={aiCopilotQuery}
                isMobile={isMobile}
                onClose={closeAICopilot}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!activeConversation && !isMobile && (
          <div className="flex-1">
            <EmptyState
              title="No conversation selected"
              description="Select a conversation from the list to start chatting"
            />
          </div>
        )}
      </div>
    </div>
  )
}
