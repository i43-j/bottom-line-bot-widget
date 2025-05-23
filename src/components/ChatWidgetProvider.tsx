
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatWidget from './ChatWidget';

// Component for use within React applications
export const ChatWidgetProvider: React.FC = () => {
  // Create a QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChatWidget userId="" />
    </QueryClientProvider>
  );
};

// For direct script inclusion - creates a div and renders the widget into it
const createWidgetContainer = () => {
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  document.body.appendChild(container);
  return container;
};

// This function can be called when the script is loaded from a CDN or directly
export const initializeChatWidget = () => {
  if (typeof window === 'undefined') return;

  // Check if the document is fully loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const container = createWidgetContainer();
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatWidgetProvider />
      </React.StrictMode>
    );
  } else {
    // Wait for the document to load
    window.addEventListener('DOMContentLoaded', () => {
      const container = createWidgetContainer();
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <ChatWidgetProvider />
        </React.StrictMode>
      );
    });
  }
};

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined' && !window.document.getElementById('chat-widget-container')) {
  initializeChatWidget();
}
