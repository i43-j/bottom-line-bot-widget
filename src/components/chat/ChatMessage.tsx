
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from './types';
import ReactMarkdown from 'react-markdown';
import ChatForm from './ChatForm';
import { FormConfig } from './types';

interface ChatMessageProps {
  message: Message & { isLoading?: boolean };
  formatTime: (date: Date) => string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, formatTime }) => {
  return (
    <div 
      className={cn(
        "flex flex-col max-w-[80%] rounded-lg p-3 animate-fade-in mb-3",
        message.sender === 'user' 
          ? "bg-chatbot-red text-white ml-auto shadow-md" 
          : "bg-gray-100 text-chatbot-dark mr-auto shadow-sm"
      )}
    >
      {message.isLoading ? (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_0.8s_infinite_0.1s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_0.8s_infinite_0.2s]"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-[bounce_0.8s_infinite_0.3s]"></div>
        </div>
      ) : (
        message.sender === 'bot' ? (
          <>
            <div className="markdown-content text-sm prose prose-sm max-w-none">
              {/* Safely handle content that might be undefined */}
              <ReactMarkdown>{message.content || ''}</ReactMarkdown>
            </div>
            {message.form && (
              <ChatForm 
                schema={{
                  // Ensure title is provided as required by FormSchema
                  title: message.form.title || "Form",
                  fields: message.form.fields,
                  submitLabel: message.form.submitLabel
                }} 
                onSubmit={(data) => console.log('Form submitted:', data)} 
              />
            )}
          </>
        ) : (
          <span className="text-sm">{message.content || ''}</span>
        )
      )}
      <span className="text-xs opacity-70 mt-1 self-end">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};
