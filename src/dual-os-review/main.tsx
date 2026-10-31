import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DualOsReview } from './DualOsReview';
import '../pixel-desktop/pixel-desktop.css';
import './dual-os-review.css';

createRoot(document.getElementById('root')!).render(<StrictMode><DualOsReview /></StrictMode>);
