
// src/components/chat/ChatForm.tsx
import React, { useState } from 'react';
import type { FormSchema } from './useChatWidget';

type Props = {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
};

export default function ChatForm({ schema, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    // Safely handle the field value
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      style={{ padding: '1em', border: '1px solid #ddd', borderRadius: 4 }}
    >
      <h4>{schema?.title || 'Form'}</h4>
      {schema?.fields?.map((field) => (
        <div key={field.id} style={{ margin: '0.5em 0' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            {field.label}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              required={field.required}
              placeholder={field.placeholder || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ width: '100%', minHeight: 60 }}
            />
          ) : field.type === 'radio' && field.options ? (
            field.options.map((opt) => (
              <label key={opt.value} style={{ marginRight: '1em' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  required={field.required}
                  onChange={() => handleInputChange(field.id, opt.value)}
                />{' '}
                {opt.label}
              </label>
            ))
          ) : (
            <input
              type={field.type}
              required={field.required}
              placeholder={field.placeholder || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ width: '100%' }}
            />
          )}
        </div>
      ))}
      <button type="submit">{schema?.submitLabel || 'Submit'}</button>
    </form>
  );
}
