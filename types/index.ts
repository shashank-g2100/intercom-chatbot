export interface User {
  name: string
  company?: string
  avatar: string
  initial: string
  isBot?: boolean
}

export interface Conversation {
  id: string
  user: User
  preview: string
  subtext?: string
  time: string
  unread: boolean
  priority?: boolean
}

export interface Message {
  id: string
  sender: "user" | "agent" | "system" | "notification"
  content: string
  timestamp: Date
  hasAiOption?: boolean
  aiProcessing?: boolean
  aiSuggestion?: string
  hasBot?: boolean
  seen?: boolean
}
