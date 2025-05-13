// File: src/components/ChatWidget.tsx
import React, { useState } from 'react';
import { useChatWidget } from '../hooks/useChatWidget';
import ChatForm from './chat/ChatForm';

export default function ChatWidget({ userId }: { userId: string }) {
  const { messages, sendMessage, submitForm } = useChatWidget(userId);
  const [input, setInput] = useState<string>('');  // <-- always a string

  return (
    <div className="chat-widget-container">
      <div className="chat-messages">
        {messages.map((m) =>
          m.form ? (
            <ChatForm key={m.id} schema={m.form} onSubmit={submitForm} />
          ) : (
            <div
              key={m.id}
              className={`chat-bubble ${m.sender === 'bot' ? 'bot' : 'user'}`}
            >
              {m.text}
            </div>
          )
        )}
      </div>

      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          // Safe-coerce to string and trim
          const raw = input ?? '';
          const text = raw.toString().trim();
          if (!text) return;
          sendMessage(text);
          setInput('');
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
}
