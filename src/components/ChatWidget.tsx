import React, { useState } from 'react';
import { useChatWidget, ChatMessage } from '../hooks/useChatWidget';
import ChatForm from './ChatForm';

export default function ChatWidget({ userId }: { userId: string }) {
  const { messages, sendMessage, submitForm } = useChatWidget(userId);
  const [input, setInput] = useState<string>('');

  return (
    <div style={{ width: 300, border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ height: 400, overflowY: 'auto', padding: 16 }}>
        {messages.map((m: ChatMessage) =>
          m.form ? (
            <ChatForm key={m.id} schema={m.form} onSubmit={submitForm} />
          ) : (
            <div
              key={m.id}
              style={{
                margin: '8px 0',
                textAlign: m.sender === 'bot' ? 'left' : 'right',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: m.sender === 'bot' ? '#eee' : '#007bff',
                  color: m.sender === 'bot' ? '#000' : '#fff',
                  padding: '8px 12px',
                  borderRadius: 16,
                }}
              >
                {m.content}
              </span>
              <div style={{ fontSize: '0.7em', color: '#666', marginTop: 4 }}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )
        )}
      </div>

      <form
        style={{ display: 'flex', borderTop: '1px solid #ccc' }}
        onSubmit={(e) => {
          e.preventDefault();
          const raw = input ?? '';
          const text = raw.toString().trim();
          if (!text) return;
          sendMessage(text);
          setInput('');
        }}
      >
        <input
          style={{ flex: 1, padding: 8, border: 'none' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button style={{ padding: '0 16px' }} type="submit">
          ➤
        </button>
      </form>
    </div>
  );
}
