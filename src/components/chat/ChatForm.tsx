
import React, { useState } from 'react';
import { FormConfig } from './types';
import { useForm } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useChatContext } from './ChatContext';

interface ChatFormProps {
  formConfig: FormConfig;
  messageId: string;
}

export const ChatForm: React.FC<ChatFormProps> = ({ formConfig, messageId }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { sendFormSubmission } = useChatContext();
  
  const form = useForm({
    defaultValues: formConfig.fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as Record<string, any>),
  });

  const onSubmit = async (data: Record<string, any>) => {
    await sendFormSubmission(messageId, data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mt-3 text-sm text-green-600">
        Thank you! Your response has been submitted.
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
      {formConfig.title && (
        <h3 className="font-medium mb-3 text-chatbot-dark">{formConfig.title}</h3>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {formConfig.fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                  
                  <FormControl>
                    {field.type === 'text' || field.type === 'email' ? (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        {...formField}
                      />
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        required={field.required}
                        {...formField}
                      />
                    ) : field.type === 'select' && field.options ? (
                      <Select
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'radio' && field.options ? (
                      <RadioGroup
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                        className="flex flex-col space-y-1"
                      >
                        {field.options.map(option => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                            <label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Input {...formField} />
                    )}
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          
          <Button 
            type="submit" 
            className="bg-chatbot-red hover:bg-red-600 text-white"
          >
            {formConfig.submitLabel}
          </Button>
        </form>
      </Form>
    </div>
  );
};
