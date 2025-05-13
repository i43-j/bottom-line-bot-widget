
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'radio' | 'checkbox' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  title?: string;
  fields: FormField[];
  submitLabel: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  form?: FormConfig;
}
