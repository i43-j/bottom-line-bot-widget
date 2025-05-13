// src/hooks/useChatWidget.ts
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

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHAT_HOOK!;

export function useChatWidget(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const append = (msg: Message) =>
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() }]);

  async function sendMessage(text: string) {
    append({ sender: 'user', text });
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
  }

  async function submitForm(formData: Record<string, any>) {
    append({ sender: 'user', text: '(submitted form)' });
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, formSubmission: true, formData }),
    });
    const ack = await res.json();
    append({ sender: 'bot', text: ack.message });
  }

  return { messages, sendMessage, submitForm };
}
