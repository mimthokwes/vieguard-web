/**
 * Client-side parsing of the student size roster (.xlsx or .csv).
 * .xlsx is a zip of XML parts; we read it with the browser's DecompressionStream
 * and DOMParser so no spreadsheet dependency is needed.
 */

export const ROSTER_COLUMNS = [
  'No',
  'Nama Siswa',
  'Jenis Kelamin (L/P)',
  'Tinggi Badan (cm)',
  'Ukuran (XS/S/M/L/XL/XXL)',
  'Peran / Posisi',
  'Lingkar Dada (cm)',
  'Panjang Lengan (cm)',
  'Panjang Celana/Rok (cm)',
  'Lingkar Kepala Shako (cm)',
] as const;

export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export interface RosterRow {
  name: string;
  gender?: string;
  heightCm?: number;
  size: string;
  role?: string;
}

export interface RosterResult {
  fileName: string;
  fileSize: number;
  rows: RosterRow[];
  invalidRows: number[];
  sizeCounts: Record<string, number>;
}

export const MAX_ROSTER_BYTES = 10 * 1024 * 1024;

export function rosterTemplateCsv(): string {
  const example = [
    ['1', 'Contoh Nama Siswa', 'L', '160', 'M', 'Snare Drum', '86', '58', '98', '56'],
    ['2', 'Contoh Nama Siswi', 'P', '152', 'S', 'Mayoret', '80', '54', '90', '54'],
  ];
  return [ROSTER_COLUMNS, ...example].map((r) => r.map(csvCell).join(',')).join('\r\n');
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function downloadRosterTemplate() {
  // BOM so Excel opens the UTF-8 CSV with correct characters.
  const blob = new Blob(['﻿' + rosterTemplateCsv()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template_ukuran_seragam_vieguard.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseRosterFile(file: File): Promise<RosterResult> {
  if (file.size > MAX_ROSTER_BYTES) throw new Error('Ukuran berkas melebihi 10MB.');
  const lower = file.name.toLowerCase();
  let table: string[][];
  if (lower.endsWith('.csv')) {
    table = parseCsv(await file.text());
  } else if (lower.endsWith('.xlsx')) {
    table = await parseXlsx(await file.arrayBuffer());
  } else {
    throw new Error('Format tidak didukung. Gunakan berkas .xlsx atau .csv.');
  }
  return toRoster(file, table);
}

function toRoster(file: File, table: string[][]): RosterResult {
  const headerIdx = table.findIndex((r) => r.some((c) => /nama/i.test(c)));
  if (headerIdx === -1) throw new Error('Kolom "Nama Siswa" tidak ditemukan. Gunakan template resmi.');
  const header = table[headerIdx]!.map((h) => h.toLowerCase());
  const col = (re: RegExp) => header.findIndex((h) => re.test(h));
  const iName = col(/nama/);
  const iGender = col(/kelamin|gender/);
  const iHeight = col(/tinggi/);
  const iSize = col(/^ukuran|size/);
  const iRole = col(/peran|posisi|role/);
  if (iSize === -1) throw new Error('Kolom "Ukuran" tidak ditemukan. Gunakan template resmi.');

  const rows: RosterRow[] = [];
  const invalidRows: number[] = [];
  table.slice(headerIdx + 1).forEach((r, i) => {
    const name = (r[iName] ?? '').trim();
    const size = (r[iSize] ?? '').trim().toUpperCase();
    if (!name && !size) return; // blank line
    if (!name || !size) {
      invalidRows.push(headerIdx + i + 2);
      return;
    }
    rows.push({
      name,
      size,
      gender: iGender >= 0 ? (r[iGender] ?? '').trim().toUpperCase().slice(0, 1) || undefined : undefined,
      heightCm: iHeight >= 0 ? Number(r[iHeight]) || undefined : undefined,
      role: iRole >= 0 ? (r[iRole] ?? '').trim() || undefined : undefined,
    });
  });
  if (rows.length === 0) throw new Error('Tidak ada baris data siswa yang valid di berkas.');

  const sizeCounts: Record<string, number> = {};
  for (const row of rows) sizeCounts[row.size] = (sizeCounts[row.size] ?? 0) + 1;
  return { fileName: file.name, fileSize: file.size, rows, invalidRows, sizeCounts };
}

/* ---------- CSV ---------- */

function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, '');
  const delimiter = (clean.split('\n')[0]?.match(/;/g)?.length ?? 0) > (clean.split('\n')[0]?.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]!;
    if (quoted) {
      if (ch === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && clean[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/* ---------- XLSX (zip + XML) ---------- */

async function parseXlsx(buffer: ArrayBuffer): Promise<string[][]> {
  const entries = readZipEntries(buffer);
  const read = async (name: string) => {
    const entry = entries.get(name);
    return entry ? new TextDecoder().decode(await inflateEntry(buffer, entry)) : null;
  };

  const sharedXml = await read('xl/sharedStrings.xml');
  const shared: string[] = [];
  if (sharedXml) {
    const doc = new DOMParser().parseFromString(sharedXml, 'application/xml');
    for (const si of Array.from(doc.getElementsByTagName('si'))) {
      shared.push(Array.from(si.getElementsByTagName('t')).map((t) => t.textContent ?? '').join(''));
    }
  }

  const sheetName = [...entries.keys()].filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0];
  if (!sheetName) throw new Error('Lembar kerja tidak ditemukan di berkas Excel.');
  const sheetXml = (await read(sheetName))!;
  const doc = new DOMParser().parseFromString(sheetXml, 'application/xml');
  const table: string[][] = [];
  for (const rowEl of Array.from(doc.getElementsByTagName('row'))) {
    const row: string[] = [];
    for (const c of Array.from(rowEl.getElementsByTagName('c'))) {
      const ref = c.getAttribute('r') ?? '';
      const colIdx = columnIndex(ref.replace(/\d+/g, ''));
      const type = c.getAttribute('t');
      let value = '';
      if (type === 'inlineStr') value = Array.from(c.getElementsByTagName('t')).map((t) => t.textContent ?? '').join('');
      else {
        const v = c.getElementsByTagName('v')[0]?.textContent ?? '';
        value = type === 's' ? shared[Number(v)] ?? '' : v;
      }
      row[colIdx >= 0 ? colIdx : row.length] = value;
    }
    table.push(Array.from(row, (v) => v ?? ''));
  }
  return table;
}

function columnIndex(letters: string) {
  let n = 0;
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

interface ZipEntry {
  method: number;
  compressedSize: number;
  localOffset: number;
}

function readZipEntries(buffer: ArrayBuffer): Map<string, ZipEntry> {
  const view = new DataView(buffer);
  let eocd = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('Berkas Excel rusak atau bukan format .xlsx.');
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const entries = new Map<string, ZipEntry>();
  const decoder = new TextDecoder();
  for (let i = 0; i < count; i++) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, offset + 46, nameLen));
    entries.set(name, { method, compressedSize, localOffset });
    offset += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function inflateEntry(buffer: ArrayBuffer, entry: ZipEntry): Promise<Uint8Array> {
  const view = new DataView(buffer);
  const nameLen = view.getUint16(entry.localOffset + 26, true);
  const extraLen = view.getUint16(entry.localOffset + 28, true);
  const start = entry.localOffset + 30 + nameLen + extraLen;
  const data = new Uint8Array(buffer, start, entry.compressedSize);
  if (entry.method === 0) return data;
  if (entry.method !== 8) throw new Error('Metode kompresi Excel tidak didukung.');
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
