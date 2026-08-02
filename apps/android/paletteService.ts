// JAG Lab — Palette CSV import/export service
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { MATERIALS_DB } from '../data/materials';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import type { Material } from '../data/materials';

const CSV_HEADER = 'id,name,family,note,description,ifra_limit,min_pct,max_pct,tenacity_hours,impact,cas,role';

function q(s: string | null | undefined): string {
  if (s == null || s === '') return '';
  return `"${String(s).replace(/"/g, '""')}"`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function getAllMaterials(): Promise<Material[]> {
  const custom = await loadJSON<Material[]>(STORAGE_KEYS.materials, []);
  const customMap = new Map(custom.map((m) => [m.id, m]));
  const builtinIds = new Set(MATERIALS_DB.map((m) => m.id));
  const merged = MATERIALS_DB.map((m) => customMap.get(m.id) ?? m);
  custom.filter((m) => !builtinIds.has(m.id)).forEach((m) => merged.push(m));
  return merged;
}

export async function exportPaletteCSV(): Promise<void> {
  const all = await getAllMaterials();
  const rows = all.map((m) =>
    [
      m.id,
      q(m.name),
      q(m.fam),
      m.note ?? '',
      q(m.desc),
      m.ifra ?? '',
      m.rMin ?? '',
      m.rMax ?? '',
      m.tenacity ?? '',
      m.impact ?? '',
      m.cas ?? '',
      m.role ?? '',
    ].join(','),
  );
  const csv = [CSV_HEADER, ...rows].join('\n');
  const path = (FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '') + 'JAGLab_Palette.csv';
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export JAG Lab Palette' });
}

export async function importPaletteCSV(): Promise<number> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['text/*', 'application/csv', '*/*'], copyToCacheDirectory: true });
  if (result.canceled || !result.assets?.[0]) return 0;

  const content = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error('CSV has no data rows');

  const headers = parseCSVLine(lines[0]);
  const idx = (name: string) => headers.indexOf(name);
  const idIdx = idx('id');
  const nameIdx = idx('name');
  const famIdx = idx('family');
  const noteIdx = idx('note');
  const descIdx = idx('description');
  const ifraIdx = idx('ifra_limit');
  const rMinIdx = idx('min_pct');
  const rMaxIdx = idx('max_pct');
  const tenIdx = idx('tenacity_hours');
  const impIdx = idx('impact');
  const casIdx = idx('cas');
  const roleIdx = idx('role');

  if (idIdx < 0 || nameIdx < 0) throw new Error('CSV must have "id" and "name" columns');

  const imported: Material[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = parseCSVLine(lines[i]);
    const id = c[idIdx];
    if (!id) continue;
    const num = (colIdx: number) => {
      const v = colIdx >= 0 ? parseFloat(c[colIdx]) : NaN;
      return Number.isFinite(v) ? v : null;
    };
    imported.push({
      id,
      name: c[nameIdx] ?? '',
      fam: c[famIdx] ?? '',
      note: c[noteIdx] ?? '',
      desc: c[descIdx] ?? '',
      ifra: num(ifraIdx),
      rMin: num(rMinIdx) ?? 0,
      rMax: num(rMaxIdx) ?? 10,
      indolic: false,
      sens: false,
      tenacity: num(tenIdx),
      impact: num(impIdx),
      ...(casIdx >= 0 && c[casIdx] ? { cas: c[casIdx] } : {}),
      ...(roleIdx >= 0 && c[roleIdx] ? { role: c[roleIdx] } : {}),
    });
  }

  const existing = await loadJSON<Material[]>(STORAGE_KEYS.materials, []);
  const existingMap = new Map(existing.map((m) => [m.id, m]));
  imported.forEach((m) => existingMap.set(m.id, m));
  await saveJSON(STORAGE_KEYS.materials, Array.from(existingMap.values()));
  return imported.length;
}
