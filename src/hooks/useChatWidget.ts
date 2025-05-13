
import { useState } from 'react';
import { FormConfig, Message } from '../components/chat/types';
import { v4 as uuidv4 } from 'uuid';

// Use a hardcoded fallback URL instead of relying on process.env
const WEBHOOK_URL = 'https://example.com/api/chat';

export function useChatWidget(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const append = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...msg,
      id: uuidv4(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  async function sendMessage(text: string) {
    if (!text || typeof text !== 'string') return;
    
    // Add user message immediately
    append({ sender: 'user', content: text });
    
    try {
      // In a real app, you'd send the message to a server
      // For now, simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a bot response
      append({ sender: 'bot', content: `You said: ${text}` });
      
      // Occasionally add a form for demo purposes
      if (text.toLowerCase().includes('form') || Math.random() > 0.8) {
        append({ 
          sender: 'bot', 
          content: 'Please fill out this form:',
          form: {
            title: 'Information Request',
            fields: [
              { id: 'name', label: 'Name', type: 'text', required: true },
              { id: 'email', label: 'Email', type: 'email', required: true },
              { id: 'feedback', label: 'Comments', type: 'textarea' }
            ],
            submitLabel: 'Submit'
          } 
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      append({ 
        sender: 'bot', 
        content: 'Sorry, there was an error processing your request.'
      });
    }
  }

  async function submitForm(formData: Record<string, any>) {
    append({ 
      sender: 'user', 
      content: '(submitted form)'
    });
    
    try {
      // Simulate processing form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      append({ 
        sender: 'bot', 
        content: 'Thank you for submitting the form. We\'ll get back to you soon!'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      append({ 
        sender: 'bot', 
        content: 'Sorry, there was an error submitting your form.'
      });
    }
  }

  return { messages, sendMessage, submitForm };
}
