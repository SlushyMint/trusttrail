import { useId, type ReactNode } from 'react';

type NoticeProps = {
  title: string;
  children: ReactNode;
  tone?: 'info' | 'warning';
  live?: boolean;
};

export function Notice({ title, children, tone = 'info', live = false }: NoticeProps) {
  const titleId = useId();
  return (
    <aside className={`notice notice--${tone}`} aria-labelledby={titleId} role={live ? 'status' : undefined}>
      <p className="notice__title" id={titleId}>{title}</p>
      <div>{children}</div>
    </aside>
  );
}
