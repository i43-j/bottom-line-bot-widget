
import { useState } from 'react';

export type FormSchema = {
  title: string;
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

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHAT_HOOK || 'https://example.com/api/chat';

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
        append({ sender: 'bot', text: data.reply, form: data.form });
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
