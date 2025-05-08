
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

To change the webhook URL, modify the `sendMessage` function in `src/components/ChatWidget.tsx`.

## Customization

- Colors: Edit the `chatbot` colors in `tailwind.config.ts`
- Styles: Modify the component styles in `ChatWidget.tsx`

## Building the Standalone Widget

```sh
npm run build:widget
```

This will create distribution files in `dist/widget/` that you can host on any CDN or web server.

## License

MIT
