
import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  inputMessage, 
  setInputMessage, 
  handleKeyPress, 
  sendMessage,
  isLoading,
  inputRef
}) => {
  return (
    <div className="border-t p-3 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-chatbot-red min-h-[40px] max-h-[120px] transition-all duration-200"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-chatbot-red hover:bg-red-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
