import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { MotionConfig } from 'motion/react';
import { App } from './app/App';
import { GameProvider } from './app/GameProvider';
import { AudioProvider } from './features/audio/AudioProvider';
import './styles/index.css';
import './features/os/chrome.css';
import './features/os/saku.css';
import './features/os/production.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user"><AudioProvider><GameProvider><App /></GameProvider></AudioProvider></MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);
