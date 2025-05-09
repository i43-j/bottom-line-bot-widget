
import React from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatWidget } from './chat/useChatWidget';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';

export const ChatWidget = () => {
  const {
    isOpen,
    messages,
    inputMessage,
    isLoading,
    isPulsing,
    isAnimating,
    messagesEndRef,
    inputRef,
    toggleChat,
    sendMessage,
    setInputMessage,
    handleKeyPress,
    formatTime
  } = useChatWidget();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Popup */}
      <div 
        className={cn(
          "w-96 md:w-[420px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 mb-3",
          isOpen ? "h-[250px] animate-slide-up" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Chat Header */}
        <ChatHeader toggleChat={toggleChat} />

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto h-[120px] scroll-smooth">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                formatTime={formatTime} 
              />
            ))}
            {isLoading && (
              <ChatMessage 
                message={{
                  id: 'loading',
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
        </div>

        {/* Input Area */}
        <ChatInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "bg-chatbot-red hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300",
          isOpen ? "scale-90 rotate-0" : "scale-100 hover:scale-105 rotate-0",
          isPulsing && !isOpen ? "animate-[pulse_2s_infinite]" : "",
          isAnimating && isOpen ? "animate-scale-in" : "",
          isAnimating && !isOpen ? "animate-scale-out" : ""
        )}
        style={{ width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <ChevronDown className="h-8 w-8 transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-8 w-8 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};
