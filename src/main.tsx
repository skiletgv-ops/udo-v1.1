import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GlobalSystemProvider } from './components/GlobalSystemContext';
import { ConsultationProvider } from './context/ConsultationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalSystemProvider>
      <ConsultationProvider>
        <App />
      </ConsultationProvider>
    </GlobalSystemProvider>
  </StrictMode>,
);


