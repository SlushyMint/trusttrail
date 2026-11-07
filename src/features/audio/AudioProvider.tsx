import { useEffect, useState, type ReactNode } from 'react';
import { AudioService } from './AudioService';
import { AudioServiceContext } from './audio-context';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audio] = useState(() => new AudioService());
  useEffect(() => audio.attach(), [audio]);
  return <AudioServiceContext value={audio}>{children}</AudioServiceContext>;
}
