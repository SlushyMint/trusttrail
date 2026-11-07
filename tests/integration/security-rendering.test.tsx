import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { BrowserApp, FilesApp } from '../../src/features/os/SharedApps';
import { chapterOne } from '../../src/content/chapters/c1';
import { initialGame } from '../../src/engine/reducer';

it('renders HTML-like source/record values as literal React text, including dangerous URL strings', () => {
  const payload = '<img src=x onerror="window.__phase6Payload=true"><script>alert(1)</script>';
  const chapter = { ...chapterOne, objective: payload, source: { ...chapterOne.source, address: 'javascript:alert(1)', provenance: payload } };
  const { container } = render(<><FilesApp chapter={chapter} /><BrowserApp chapter={chapter} game={initialGame()} send={vi.fn()} notify={vi.fn()} openApp={vi.fn()} /></>);
  expect(screen.getAllByText(payload)).toHaveLength(2);
  expect(screen.getByText('javascript:alert(1)').tagName).toBe('SPAN');
  expect(container.querySelector('img, script, iframe, a[href^="javascript:"]')).toBeNull();
  expect(Object.hasOwn(window, '__phase6Payload')).toBe(false);
});
