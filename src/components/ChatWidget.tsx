
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ChevronDown, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [userId] = useState(() => {
    // Check if userId exists in localStorage, if not generate a new one
    const storedId = localStorage.getItem('chatWidgetUserId');
    if (storedId) return storedId;
    
    const newId = uuidv4();
    localStorage.setItem('chatWidgetUserId', newId);
    return newId;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add welcome message when widget is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Hello! How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to the bottom of message container when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // When opened, clear the pulse effect
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
        setIsPulsing(false);
      }
    } else {
      // Start the pulse timer when chat is minimized
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      
      pulseTimeoutRef.current = setTimeout(() => {
        setIsPulsing(true);
      }, 3000); // 3 seconds as requested
    }
    
    // Cleanup
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Send to webhook with the user ID in the required format
      const response = await fetch('https://mactest2.app.n8n.cloud/webhook/cb3e7489-f7ea-45bf-b8d2-646b7942479b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp,
          userId: `{{ $json.body.userId }}:${userId}` // Format as requested
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // For now we'll simulate a response since we don't know how your webhook returns data
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message! Our team will get back to you soon.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error sending your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <div className="bg-chatbot-red p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Chat Support</h3>
          </div>
          <button onClick={toggleChat} className="text-white hover:bg-white/10 rounded-full p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto h-[420px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col max-w-[80%] rounded-lg p-3",
                  msg.sender === 'user' 
                    ? "bg-chatbot-red text-white ml-auto" 
                    : "bg-gray-100 text-chatbot-dark mr-auto"
                )}
              >
                <span className="text-sm">{msg.content}</span>
                <span className="text-xs opacity-70 mt-1 self-end">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
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
        <div className="border-t p-3 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-chatbot-red min-h-[40px] max-h-[120px]"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-chatbot-red hover:bg-red-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
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
