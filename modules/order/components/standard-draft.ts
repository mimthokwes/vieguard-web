import { RosterResult } from '@/lib/roster/roster';
import { STANDARD_DRAFT_KEY } from '../data';

export interface StandardDraft {
  institution: string;
  pic: string;
  phone: string;
  eventDate: string;
  jenjang: string;
  category: string;
  color: string;
  notes: string;
  address: string;
  roster: RosterResult | null;
}

export const EMPTY_DRAFT: StandardDraft = {
  institution: '',
  pic: '',
  phone: '',
  eventDate: '',
  jenjang: '',
  category: '',
  color: '',
  notes: '',
  address: '',
  roster: null,
};

export function loadDraft(): StandardDraft | null {
  try {
    const raw = localStorage.getItem(STANDARD_DRAFT_KEY);
    return raw ? { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<StandardDraft>) } : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: StandardDraft) {
  try {
    localStorage.setItem(STANDARD_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage full or blocked — the in-memory draft still works for this visit.
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STANDARD_DRAFT_KEY);
  } catch {
    // ignore
  }
}

/** Earliest acceptable event date: 14 days from today (minimum production window). */
export function minEventDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}
