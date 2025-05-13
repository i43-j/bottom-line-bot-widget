
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormConfig, Message } from '../components/chat/types';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  form?: any;
}

// 🔥 Hard-code your webhook URL here:
const WEBHOOK_URL =
  'https://mactest2.app.n8n.cloud/webhook/cb3e7489-f7ea-45bf-b8d2-646b7942479b';

export function useChatWidget(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const append = (msg: Omit<Message, 'id'>) =>
    setMessages((prev) => [
      ...prev,
      { ...msg, id: Date.now().toString() },
    ]);

  async function sendMessage(text: string) {
    // 1️⃣ add the user's message
    append({
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    });

    try {
      // 2️⃣ POST to your webhook
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: text }),
      });
      const data = await res.json();

      // 3️⃣ append the bot's reply (or form)
      append({
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toISOString(),
        form: data.form,
      });
    } catch (err) {
      console.error(err);
      append({
        sender: 'bot',
        text: 'Oops—something went wrong. Please try again later.',
        timestamp: new Date().toISOString(),
      });
    }
  }

  return { messages, sendMessage };
}

