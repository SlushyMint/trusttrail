import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PixelDesktop } from './PixelDesktop';
import './pixel-desktop.css';

createRoot(document.getElementById('root')!).render(<StrictMode><PixelDesktop /></StrictMode>);
