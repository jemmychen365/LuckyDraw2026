import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add some basic global CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
  .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
`;
document.head.appendChild(style);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
