
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
import './services/MapAPI'; // Initialize global MapAPI

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('ERROR: Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 20px;">ERROR: Root element not found!</div>';
} else {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
}


