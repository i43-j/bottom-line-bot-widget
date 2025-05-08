
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';

export const useChatWidget = () => {
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

  // Focus input when chat is opened and manage pulsing animation
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

  return {
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
  };
};
