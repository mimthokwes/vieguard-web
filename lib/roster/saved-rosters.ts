import { useMemo, useSyncExternalStore } from 'react';
import { RosterResult, ROSTER_COLUMNS } from './roster';

/**
 * Size rosters the customer keeps for reuse. The backend has no storage for these yet,
 * so they live in this browser's localStorage.
 */
export interface SavedRoster extends RosterResult {
  id: string;
  savedAt: string;
}

const KEY = 'vieguard:saved-rosters';
const CHANGE_EVENT = 'vieguard:saved-rosters-changed';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

/** Saved rosters as React state, kept in sync with localStorage (empty during SSR). */
export function useSavedRosters(): SavedRoster[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '');
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as SavedRoster[]) : [];
    } catch {
      return [];
    }
  }, [raw]);
}

export function loadSavedRosters(): SavedRoster[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedRoster[]) : [];
  } catch {
    return [];
  }
}

export function saveRoster(roster: RosterResult): SavedRoster[] {
  const entry: SavedRoster = { ...roster, id: `${Date.now()}`, savedAt: new Date().toISOString() };
  const next = [entry, ...loadSavedRosters().filter((r) => r.fileName !== roster.fileName)].slice(0, 10);
  persist(next);
  return next;
}

export function deleteSavedRoster(id: string): SavedRoster[] {
  const next = loadSavedRosters().filter((r) => r.id !== id);
  persist(next);
  return next;
}

function persist(list: SavedRoster[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage full or blocked; the list just won't persist.
  }
}

/** Re-export a saved roster as CSV so the customer can edit and re-upload it. */
export function downloadRosterCsv(roster: SavedRoster) {
  const rows = roster.rows.map((r, i) => [String(i + 1), r.name, r.gender ?? '', r.heightCm ? String(r.heightCm) : '', r.size, r.role ?? '']);
  const header = ROSTER_COLUMNS.slice(0, 6);
  const csv = [header, ...rows].map((r) => r.map((c) => (/[",\r\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = roster.fileName.replace(/\.(xlsx|csv)$/i, '') + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
