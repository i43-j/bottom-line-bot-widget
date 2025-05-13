
// File: src/components/ChatWidget.tsx
import React, { useState } from 'react';
import { useChatWidget } from './chat/useChatWidget';
import ChatForm from './chat/ChatForm';

export default function ChatWidget({ userId }: { userId: string }) {
  const { messages, sendMessage, submitForm } = useChatWidget(userId || '');
  const [input, setInput] = useState<string>('');

  return (
    <div style={{
      width: 300,
      border: '1px solid #ccc',
      borderRadius: 8,
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1em',
        height: 400,
        overflowY: 'auto'
      }}>
        {Array.isArray(messages) && messages.map((m) =>
          m.form ? (
            <ChatForm
              key={m.id}
              schema={m.form}
              onSubmit={(vals) => submitForm(vals)}
            />
          ) : (
            <div
              key={m.id}
              style={{
                margin: '0.5em 0',
                textAlign: m.sender === 'bot' ? 'left' : 'right'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: m.sender === 'bot' ? '#eee' : '#007bff',
                  color: m.sender === 'bot' ? '#000' : '#fff',
                  padding: '0.5em 1em',
                  borderRadius: 16
                }}
              >
                {m.text || ''}
              </span>
            </div>
          )
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Added proper null checks with optional chaining and nullish coalescing
          const trimmedInput = input?.trim() || '';
          if (!trimmedInput) return;
          sendMessage(trimmedInput);
          setInput('');
        }}
        style={{
          display: 'flex',
          borderTop: '1px solid #ccc'
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '0.5em',
            border: 'none'
          }}
          value={input || ''}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          style={{
            padding: '0.5em 1em'
          }}
          type="submit"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
