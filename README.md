
# Chat Widget

A customizable chat widget that can be easily integrated into any website.

## Features

- Sleek, minimalist design with a red theme
- Expandable chat interface with smooth animations
- Webhook integration for message handling
- Mobile-responsive design
- Markdown support for bot messages
- Interactive forms for data collection
- Easy to integrate into any website

## Installation

### Option 1: Using in a React application

```jsx
import { ChatWidgetProvider } from './components/ChatWidgetProvider';

// In your component
function App() {
  return (
    <>
      {/* Your website content */}
      <ChatWidgetProvider />
    </>
  );
}
```

### Option 2: Using the standalone script

Add this to your HTML:

```html
<script src="https://your-hosting-url.com/chat-widget.umd.js"></script>
```

The widget will initialize automatically.

## Configuration

The widget is pre-configured to use the webhook URL:
`https://mactest2.app.n8n.cloud/webhook/cb3e7489-f7ea-45bf-b8d2-646b7942479b`

To change the webhook URL, modify the `sendMessage` function in `src/components/chat/useChatWidget.ts`.

## Customization

### Widget Size

The chat widget is configured to use 70% of the viewport height by default. To adjust this:

1. Open `src/components/ChatWidget.tsx`
2. Modify the height value in these two areas:
   ```jsx
   // Change the main container height percentage (70vh)
   isOpen ? "h-[70vh] max-h-[700px] animate-slide-up" : "h-0 opacity-0 pointer-events-none"
   ```
   
   ```jsx
   // Change the messages container height calculation (should be 'vh percentage - 130px')
   <div className="flex-1 p-4 overflow-y-auto h-[calc(70vh-130px)] max-h-[570px] scroll-smooth">
   ```

### Header Label

To change the "Chat Support" label in the header:

1. Open `src/components/chat/ChatHeader.tsx`
2. Locate and change the header text:
   ```jsx
   <h3 className="font-semibold">Chat Support</h3>
   ```
   Replace "Chat Support" with your preferred label.

### Colors

- Edit the `chatbot` colors in `tailwind.config.ts`
- Modify the component styles in `ChatWidget.tsx`

## Adding Interactive Forms

The chat widget supports interactive forms that can be sent from the bot to collect user input. To send a form, your webhook response should include a `form` property with the form configuration:

```javascript
{
  "reply": "Please fill out this quick survey:",
  "form": {
    "title": "Customer Feedback",
    "fields": [
      {
        "id": "name",
        "label": "Your Name",
        "type": "text",
        "placeholder": "Enter your name",
        "required": true
      },
      {
        "id": "email",
        "label": "Email Address",
        "type": "email",
        "placeholder": "your@email.com",
        "required": true
      },
      {
        "id": "rating",
        "label": "How would you rate our service?",
        "type": "radio",
        "options": [
          { "value": "excellent", "label": "Excellent" },
          { "value": "good", "label": "Good" },
          { "value": "fair", "label": "Fair" },
          { "value": "poor", "label": "Poor" }
        ],
        "required": true
      },
      {
        "id": "comments",
        "label": "Additional Comments",
        "type": "textarea",
        "placeholder": "Tell us more..."
      }
    ],
    "submitLabel": "Submit Feedback"
  }
}
```

When users submit the form, the data will be sent to your webhook with:

```javascript
{
  "formSubmission": true,
  "messageId": "123456",
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "rating": "excellent",
    "comments": "Great service!"
  },
  "userId": "user-uuid"
}
```

### Supported Form Field Types

- `text`: Basic text input
- `email`: Email input with validation
- `select`: Dropdown select with options
- `radio`: Radio button group
- `checkbox`: Checkbox input (coming soon)
- `textarea`: Multi-line text input

## Building the Standalone Widget

```sh
npm run build:widget
```

This will create distribution files in `dist/widget/` that you can host on any CDN or web server.

## License

MIT
