// File: src/components/chat/ChatInput.tsx

import React from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  inputMessage: string
  setInputMessage: (msg: string) => void
  sendMessage: (text: string) => Promise<void>
  isLoading: boolean
  inputRef: React.RefObject<HTMLTextAreaElement>
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  inputRef,
}: ChatInputProps) {
  // Handle Enter key without closing the widget
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      const text = inputMessage.trim()
      if (!text) return
      setInputMessage('')
      await sendMessage(text)
    }
  }

  // Handle form submit (clicking the send button)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const text = inputMessage.trim()
    if (!text) return
    setInputMessage('')
    await sendMessage(text)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-t border-gray-200"
    >
      <textarea
        ref={inputRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message…"
        className="flex-1 p-2 resize-none focus:outline-none"
        rows={1}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-2 ml-2 bg-chatbot-red hover:bg-red-600 text-white rounded-full transition"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  )
}
