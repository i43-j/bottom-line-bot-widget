
import React, { useState, useRef, useEffect } from 'react';
import { useChatWidget } from './chat/useChatWidget';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { Message } from './chat/types';

export default function ChatWidget({ userId }: { userId: string }) {
  const { messages, sendMessage, submitForm } = useChatWidget(userId || '');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages.length]);
  
  const toggleChat = () => {
    setIsOpen(prevState => !prevState);
  };
  
  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage?.trim();
    if (!trimmedMessage) return;
    
    setIsLoading(true);
    
    // Add user message immediately
    const tempId = Date.now().toString();
    
    setInputMessage('');
    
    try {
      await sendMessage(trimmedMessage);
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
      hour12: true 
    }).format(date);
  };
  
  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-chatbot-red hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    
      {/* Chat container */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 flex flex-col w-80 sm:w-96 h-[500px] rounded-lg shadow-xl bg-white overflow-hidden z-50 border border-gray-200">
          <ChatHeader toggleChat={toggleChat} />
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                formatTime={formatTime}
              />
            ))}
            
            {isLoading && (
              <ChatMessage
                message={{
                  id: "loading",
                  content: "",
                  sender: "bot",
                  timestamp: new Date(),
                  isLoading: true
                } as Message}
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
      )}
    </>
  );
}
