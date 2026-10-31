import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// jsdom has no layout observer. Viewport motion is verified in real browsers;
// keeping this inert also confirms the page's content never depends on a reveal.
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class implements IntersectionObserver {
    root = null;
    rootMargin = '0px';
    scrollMargin = '0px';
    thresholds = [0];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  };
}

// jsdom has no top layer. Native modal behavior is checked in the real browser suite.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
}
