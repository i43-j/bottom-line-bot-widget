
import React from 'react';
import { Send } from 'lucide-react';



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
  // Handle Enter without letting it bubble up to close the widget
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()           // ← prevent chat bubble from closing
      const text = inputMessage.trim()
      if (!text) return
      setInputMessage('')
      await sendMessage(text)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()             // ← also here, just in case
    const text = inputMessage.trim()
    if (!text) return
    setInputMessage('')
    await sendMessage(text)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', borderTop: '1px solid #ccc' }}
    >
      <textarea
        ref={inputRef}
        value={inputMessage}
        onChange={e => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}   // ← wired to KeyDown
        placeholder="Type your message…"
        style={{
          flex: 1,
          padding: 8,
          border: 'none',
          resize: 'none',
        }}
        rows={1}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{ padding: '0 16px' }}
      >
        ➤
      </button>
    </form>
  )
}
