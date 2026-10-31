import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../src/components/ui/Button';
import { Drawer } from '../../src/components/ui/Drawer';
import { Notice } from '../../src/components/ui/Notice';
import { Tabs } from '../../src/components/ui/Tabs';

describe('Button', () => {
  it('does not accidentally submit a form, and can be activated by keyboard', async () => {
    const user = userEvent.setup();
    const submit = vi.fn(event => event.preventDefault());
    const click = vi.fn();
    render(<form onSubmit={submit}><Button onClick={click}>Lanjut</Button></form>);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });

  it('does not activate when disabled', async () => {
    const click = vi.fn();
    render(<Button disabled onClick={click}>Belum tersedia</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(click).not.toHaveBeenCalled();
  });
});

describe('Tabs', () => {
  const tabs = [
    { id: 'artifact', label: 'Artefak', content: <button>Periksa</button> },
    { id: 'notes', label: 'Catatan', content: <button>Buka catatan</button> },
  ];

  it('moves focus and selection with arrows, Home and End, excluding hidden controls', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Ruang misi" tabs={tabs} />);
    const first = screen.getByRole('tab', { name: 'Artefak' });
    const last = screen.getByRole('tab', { name: 'Catatan' });
    await user.tab();
    expect(document.activeElement).toBe(first);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(last);
    expect(last.getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByRole('button', { name: 'Periksa' })).toBeNull();
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(first);
    await user.keyboard('{End}');
    expect(document.activeElement).toBe(last);
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(first);
  });

  it('associates each tab with its panel and supports pointer activation', async () => {
    render(<Tabs label="Ruang misi" tabs={tabs} />);
    const tab = screen.getByRole('tab', { name: 'Catatan' });
    await userEvent.click(tab);
    const panel = screen.getByRole('tabpanel', { name: 'Catatan' });
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
  });

  it('allows an empty list without creating an empty tablist', () => {
    render(<Tabs label="Vide" tabs={[]} />);
    expect(screen.queryByRole('tablist')).toBeNull();
  });
});

function DrawerHarness() {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Buka jurnal</Button><Drawer title="Jurnal bukti" open={open} onClose={() => setOpen(false)}><p>Belum ada bukti</p></Drawer></>;
}

describe('Drawer', () => {
  it('focuses its close action and returns focus to the trigger after dismissal', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    const trigger = screen.getByRole('button', { name: 'Buka jurnal' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Jurnal bukti' });
    const close = screen.getByRole('button', { name: 'Tutup Jurnal bukti' });
    expect(document.activeElement).toBe(close);
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Notice', () => {
  it('announces a changing status only when explicitly requested', () => {
    const { rerender } = render(<Notice title="Informasi">Cerita belum tersedia.</Notice>);
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<Notice title="Informasi" live>Perubahan tersimpan.</Notice>);
    expect(screen.getByRole('status', { name: 'Informasi' }).textContent).toContain('Perubahan tersimpan.');
  });
});
