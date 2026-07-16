import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GlobalSystemProvider } from './components/GlobalSystemContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalSystemProvider>
      <App />
    </GlobalSystemProvider>
  </StrictMode>,
);

