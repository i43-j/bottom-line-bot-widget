
import { ChatWidgetProvider } from '@/components/ChatWidgetProvider';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Chat Widget Demo</h1>
        <p className="text-xl text-gray-600 mb-8">
          Click on the chat bubble in the bottom-right corner to try the widget.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How to use this widget</h2>
          <div className="text-left space-y-4">
            <p><strong>Option 1:</strong> Include the widget in your React app</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {`import { ChatWidgetProvider } from './components/ChatWidgetProvider';
              
// In your component
return (
  <>
    {/* Your site content */}
    <ChatWidgetProvider />
  </>
);`}
            </pre>
            
            <p><strong>Option 2:</strong> Add a script tag to your HTML</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {`<script src="https://your-site.com/chat-widget.js"></script>`}
            </pre>
            
            <p>The widget connects to your webhook endpoint for message processing.</p>
          </div>
        </div>
      </div>
      
      {/* Include the chat widget */}
      <ChatWidgetProvider />
    </div>
  );
};

export default Index;
