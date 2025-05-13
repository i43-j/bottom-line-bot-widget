
import React, { useState, useRef, useEffect } from 'react';
import { Message } from './chat/types';
import { useChatWidget } from '../hooks/useChatWidget';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { MessageSquare, X } from 'lucide-react';

export default function ChatWidget({ userId }: { userId: string }) {
  const { messages, sendMessage, submitForm } = useChatWidget(userId);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text) return;
    
    setInputMessage('');
    setIsLoading(true);

    // Create temporary loading message
    const tempMessage: Message = {
      id: `loading-${Date.now()}`,
      content: text,
      sender: 'user',
      timestamp: new Date(),
    };

    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus the input when opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-[350px] h-[500px] animate-scale-in">
          <div className="bg-chatbot-red text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="font-medium">Chat Support</div>
            <button 
              onClick={toggleChat} 
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 bg-slate-50">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id}
                message={message}
                formatTime={formatTime}
              />
            ))}
            {isLoading && (
              <ChatMessage 
                message={{
                  id: `loading-${Date.now()}`,
                  content: '',
                  sender: 'bot',
                  timestamp: new Date(),
                  isLoading: true
                }}
                formatTime={formatTime}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleKeyPress={handleKeyPress}
            sendMessage={handleSendMessage}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-chatbot-red hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
