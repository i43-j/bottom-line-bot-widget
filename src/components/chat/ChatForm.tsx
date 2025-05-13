
import React, { useState } from 'react';
import type { FormSchema } from './useChatWidget';
import { cn } from '@/lib/utils';

type Props = {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
};

export default function ChatForm({ schema, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="mt-3 p-3 border border-gray-200 rounded-md bg-white"
    >
      <h4 className="font-medium text-sm mb-2">{schema?.title || 'Form'}</h4>
      <div className="space-y-3">
        {schema?.fields?.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="block text-xs font-medium">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                className="w-full text-sm p-2 border border-gray-300 rounded resize-y min-h-[60px]"
                required={field.required}
                placeholder={field.placeholder || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            ) : field.type === 'radio' && field.options ? (
              <div className="flex flex-wrap gap-x-4">
                {field.options.map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt.value}
                      required={field.required}
                      onChange={() => handleInputChange(field.id, opt.value)}
                      className="text-chatbot-red focus:ring-chatbot-red"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full text-sm p-2 border border-gray-300 rounded"
              />
            )}
          </div>
        ))}
      </div>
      <button 
        type="submit" 
        className="mt-3 bg-chatbot-red hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        {schema?.submitLabel || 'Submit'}
      </button>
    </form>
  );
}
