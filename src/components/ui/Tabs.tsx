import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

type Tab = { id: string; label: string; content: ReactNode };
type TabsProps = { label: string; tabs: readonly Tab[]; initialTab?: string };

export function Tabs({ label, tabs, initialTab }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(initialTab ?? tabs[0]?.id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const activeId = tabs.some(tab => tab.id === active) ? active : tabs[0]?.id;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const tab = tabs[next];
    if (tab) {
      setActive(tab.id);
      buttons.current[next]?.focus();
    }
  }

  if (tabs.length === 0) return null;
  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button key={tab.id} id={`${baseId}-tab-${tab.id}`} type="button" role="tab"
            aria-selected={activeId === tab.id} aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            ref={element => { buttons.current[index] = element; }}
            onClick={() => setActive(tab.id)} onKeyDown={event => onKeyDown(event, index)}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map(tab => (
        <div key={tab.id} id={`${baseId}-panel-${tab.id}`} role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`} hidden={activeId !== tab.id} tabIndex={0}
          className="tabs__panel">
          {tab.content}
        </div>
      ))}
    </div>
  );
}
