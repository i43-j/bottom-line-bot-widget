
import React from 'react';
import { ChatWidget } from './ChatWidget';

export const ChatWidgetProvider: React.FC = () => {
  return <ChatWidget />;
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
  // Check if the document is fully loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const container = createWidgetContainer();
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(container);
      root.render(<ChatWidgetProvider />);
    });
  } else {
    // Wait for the document to load
    window.addEventListener('DOMContentLoaded', () => {
      const container = createWidgetContainer();
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(<ChatWidgetProvider />);
      });
    });
  }
};

// Auto-initialize if this script is loaded directly
if (typeof window !== 'undefined' && !window.document.getElementById('chat-widget-container')) {
  initializeChatWidget();
}
