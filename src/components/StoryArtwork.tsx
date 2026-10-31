import { useState } from 'react';
import { AriScene } from './AriScene';

type ArtworkKind = 'dossier' | 'workspace' | 'vignette';
const artwork = {
  dossier: { file: 'case-dossier', widths: [480, 960], width: 960, height: 1200 },
  workspace: { file: 'ari-workspace', widths: [600, 1200], width: 1200, height: 800 },
  vignette: { file: 'desk-vignette', widths: [480, 960], width: 960, height: 480 },
} as const;

/** Atmospheric art only: failed downloads never hide a clue, action or narrative line. */
export function StoryArtwork({ kind, alt, priority = false, className = '' }: { kind: ArtworkKind; alt: string; priority?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const asset = artwork[kind];
  if (failed) return <div className={`story-artwork story-artwork--fallback ${className}`}>
    {kind === 'workspace' ? <AriScene /> : <div className="artwork-file-fallback" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}><span /><span /><span /></div>}
  </div>;
  return <img className={`story-artwork ${className}`} src={`/artwork/${asset.file}-${asset.width}.webp`}
    srcSet={asset.widths.map(width => `/artwork/${asset.file}-${width}.webp ${width}w`).join(', ')}
    sizes={kind === 'vignette' ? '(max-width: 640px) 90vw, 400px' : '(max-width: 640px) 90vw, (max-width: 1000px) 44vw, 640px'}
    width={asset.width} height={asset.height} alt={alt} loading={priority ? 'eager' : 'lazy'}
    decoding="async" fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />;
}
