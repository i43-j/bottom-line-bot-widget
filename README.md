
# Chat Widget

A customizable chat widget that can be easily integrated into any website.

## Features

- Sleek, minimalist design with a red theme
- Expandable chat interface with smooth animations
- Webhook integration for message handling
- Mobile-responsive design
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

To adjust the widget size:

1. Open `src/components/ChatWidget.tsx`
2. Modify the height value in the className string to change the percentage of viewport height:
   ```jsx
   isOpen ? "h-[40vh] max-h-[500px] animate-slide-up" : "h-0 opacity-0 pointer-events-none"
   ```
3. Adjust the messages container height accordingly:
   ```jsx
   <div className="flex-1 p-4 overflow-y-auto h-[calc(40vh-130px)] max-h-[370px] scroll-smooth">
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

## Building the Standalone Widget

```sh
npm run build:widget
```

This will create distribution files in `dist/widget/` that you can host on any CDN or web server.

## License

MIT
