
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
          isOpen ? "h-[550px] animate-slide-up" : "h-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Chat Header */}
        <ChatHeader toggleChat={toggleChat} />

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto h-[420px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                formatTime={formatTime} 
              />
            ))}
            {isLoading && (
              <div className="flex max-w-[80%] rounded-lg p-3 bg-gray-100 text-chatbot-dark">
                <span className="animate-pulse">...</span>
              </div>
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
          "bg-chatbot-red hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-300",
          isOpen ? "scale-90" : "animate-fade-in",
          isPulsing && !isOpen ? "animate-[pulse_2s_infinite]" : ""
        )}
        style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <ChevronDown className="h-7 w-7" />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};
