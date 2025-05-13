
import React from 'react';
import { initializeChatWidget } from './components/ChatWidgetProvider';

// Initialize the widget when this file is loaded
initializeChatWidget();

// Export components for direct import usage
export { default as ChatWidget } from './components/ChatWidget';
export { ChatWidgetProvider } from './components/ChatWidgetProvider';
