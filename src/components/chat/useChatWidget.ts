
import { useState } from 'react';
import { FormConfig } from './types';

export type FormSchema = {
  title: string; // Required in FormSchema
  fields: Array<{
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
  }>;
  submitLabel: string;
};

export type Message = {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  form?: FormSchema;
};

// Use a hardcoded fallback URL instead of relying on process.env
const WEBHOOK_URL = 'https://example.com/api/chat';

export function useChatWidget(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const append = (msg: Omit<Message, 'id'>) =>
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() }]);

  async function sendMessage(text: string) {
    if (!text || typeof text !== 'string') return;
    
    append({ sender: 'user', text });
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: text }),
      });
      const data = await res.json();
      if (data.form) {
        // Ensure title is provided when creating the form
        const formWithTitle = {
          ...data.form,
          title: data.form.title || "Form"
        };
        append({ sender: 'bot', text: data.reply, form: formWithTitle });
      } else {
        append({ sender: 'bot', text: data.reply });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      append({ sender: 'bot', text: 'Sorry, there was an error processing your request.' });
    }
  }

  async function submitForm(formData: Record<string, any>) {
    append({ sender: 'user', text: '(submitted form)' });
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, formSubmission: true, formData }),
      });
      const ack = await res.json();
      append({ sender: 'bot', text: ack.message });
    } catch (error) {
      console.error('Error submitting form:', error);
      append({ sender: 'bot', text: 'Sorry, there was an error submitting your form.' });
    }
  }

  return { messages, sendMessage, submitForm };
}
