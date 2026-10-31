export type PixelKind = 'mail' | 'browser' | 'messages' | 'files' | 'journal' | 'signal' | 'check' | 'warning';

/** Original 16-unit pixel geometry. No external icon set or raster UI. */
export function PixelIcon({ kind, className = '' }: { kind: PixelKind; className?: string }) {
  return <svg className={`px-icon ${className}`} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges" aria-hidden="true">
    {kind === 'mail' ? <><path fill="var(--icon-shadow)" d="M1 4h14v10H1z" /><path fill="var(--icon-paper)" d="M1 3h14v9H1z" /><path fill="var(--icon-mid)" d="M1 4h2v2h2v2h6V6h2V4h2v2h-2v2h-2v2H5V8H3V6H1z" /><path fill="var(--icon-accent)" d="M10 10h6v5h-6z" /><path fill="var(--icon-shadow)" d="M12 11h2v2h-2z" /></> : null}
    {kind === 'browser' ? <><path fill="var(--icon-shadow)" d="M5 1h6v2h2v2h2v6h-2v2h-2v2H5v-2H3v-2H1V5h2V3h2z" /><path fill="var(--icon-mid)" d="M5 2h6v2h2v8h-2v2H5v-2H3V4h2z" /><path fill="var(--icon-accent)" d="M7 2h2v12H7zM3 7h10v2H3z" /><path fill="var(--icon-paper)" d="M5 3h2v2H5zM3 5h2v2H3zM11 10h2v2h-2z" /></> : null}
    {kind === 'messages' ? <><path fill="var(--icon-shadow)" d="M1 2h12v10H7v3H4v-3H1z" /><path fill="var(--icon-accent)" d="M2 2h11v8H7v2H5v-2H2z" /><path fill="var(--icon-shadow)" d="M4 5h2v2H4zM8 5h2v2H8z" /><path fill="var(--icon-mid)" d="M9 10h6v4h-2v2h-2v-2H9z" /></> : null}
    {kind === 'files' ? <><path fill="var(--icon-shadow)" d="M1 4h6v2h8v9H1z" /><path fill="var(--icon-mid)" d="M1 3h6v2h8v8H1z" /><path fill="var(--icon-amber)" d="M2 6h13v7H2z" /><path fill="var(--icon-paper)" d="M2 6h13v1H2z" /></> : null}
    {kind === 'journal' ? <><path fill="var(--icon-shadow)" d="M3 1h10v14H3z" /><path fill="var(--icon-paper)" d="M4 1h8v13H4z" /><path fill="var(--icon-mid)" d="M3 1h2v13H3zM6 4h4v1H6zM6 7h4v1H6zM6 10h3v1H6z" /><path fill="var(--icon-accent)" d="M10 9h2v2h3v2h-3v2h-2z" /><path fill="var(--icon-paper)" d="M12 10h1v2h-1z" /></> : null}
    {kind === 'signal' ? <><path fill="currentColor" d="M1 10h4v4H1zM6 6h4v4H6zM11 1h4v4h-4zM4 9h3v3H4zM9 4h3v3H9z" /></> : null}
    {kind === 'check' ? <path fill="currentColor" d="M1 7h3v3h2V8h2V6h2V4h2V2h3v3h-2v2h-2v2H9v2H7v3H4v-2H2v-2H1z" /> : null}
    {kind === 'warning' ? <><path fill="currentColor" d="M7 1h2v3h2v3h2v3h2v4H1v-4h2V7h2V4h2z" /><path fill="var(--px-ground)" d="M7 5h2v5H7zM7 11h2v2H7z" /></> : null}
  </svg>;
}
