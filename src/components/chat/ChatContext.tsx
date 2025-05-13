
import React, { createContext, useContext, ReactNode } from 'react';

interface ChatContextValue {
  sendFormSubmission: (messageId: string, formData: Record<string, any>) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};

interface ChatContextProviderProps {
  children: ReactNode;
  sendFormSubmission: (messageId: string, formData: Record<string, any>) => Promise<void>;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ 
  children, 
  sendFormSubmission 
}) => {
  return (
    <ChatContext.Provider value={{ sendFormSubmission }}>
      {children}
    </ChatContext.Provider>
  );
};
