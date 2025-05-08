
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatHeaderProps {
  toggleChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleChat }) => {
  return (
    <div className="bg-chatbot-red p-4 flex justify-between items-center">
      <div className="flex items-center gap-2 text-white">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-semibold">Chat Support</h3>
      </div>
      <button onClick={toggleChat} className="text-white hover:bg-white/10 rounded-full p-1">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
