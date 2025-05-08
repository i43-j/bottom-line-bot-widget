
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  formatTime: (date: Date) => string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, formatTime }) => {
  return (
    <div 
      className={cn(
        "flex flex-col max-w-[80%] rounded-lg p-3",
        message.sender === 'user' 
          ? "bg-chatbot-red text-white ml-auto" 
          : "bg-gray-100 text-chatbot-dark mr-auto"
      )}
    >
      <span className="text-sm">{message.content}</span>
      <span className="text-xs opacity-70 mt-1 self-end">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};
