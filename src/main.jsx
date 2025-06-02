import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // đã chứa Tailwind directives
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
