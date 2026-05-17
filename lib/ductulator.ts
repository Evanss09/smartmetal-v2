import type { DuctulatorInput, DuctulatorOption, DuctulatorResult } from './types';

export const CFM_CHART: Record<number, Record<number, number | null>> = {
  4:  { 4: null, 6: 60, 8: 90, 10: 120, 12: 150, 14: 180, 16: 210, 18: 240, 20: 270, 22: 300, 24: 330, 26: null, 28: null, 30: null },
  6:  { 4: 60, 6: 110, 8: 160, 10: 215, 12: 270, 14: 320, 16: 375, 18: 430, 20: 490, 22: 540, 24: 600, 26: 650, 28: 710, 30: 775 },
  8:  { 4: 90, 6: 160, 8: 230, 10: 310, 12: 400, 14: 490, 16: 580, 18: 670, 20: 750, 22: 840, 24: 930, 26: 1020, 28: 1100, 30: 1200 },
  10: { 4: 120, 6: 215, 8: 310, 10: 430, 12: 550, 14: 670, 16: 800, 18: 930, 20: 1060, 22: 1200, 24: 1400, 26: 1430, 28: 1550, 30: 1670 },
  12: { 4: 150, 6: 270, 8: 400, 10: 550, 12: 680, 14: 800, 16: 950, 18: 1100, 20: 1250, 22: 1400, 24: 1600, 26: 1750, 28: 1950, 30: 2150 },
  14: { 4: 180, 6: 320, 8: 490, 10: 670, 12: 800, 14: 950, 16: 1100, 18: 1250, 20: 1400, 22: 1550, 24: 1750, 26: 1900, 28: 2100, 30: 2300 },
  16: { 4: 210, 6: 375, 8: 580, 10: 800, 12: 950, 14: 1100, 16: 1250, 18: 1400, 20: 1600, 22: 1750, 24: 1950, 26: 2150, 28: 2350, 30: 2550 },
  18: { 4: 240, 6: 430, 8: 670, 10: 930, 12: 1100, 14: 1250, 16: 1400, 18: 1600, 20: 1800, 22: 2000, 24: 2200, 26: 2400, 28: 2600, 30: 2800 },
  20: { 4: 270, 6: 490, 8: 750, 10: 1060, 12: 1250, 14: 1400, 16: 1600, 18: 1800, 20: 2000, 22: 2200, 24: 2400, 26: 2600, 28: 2800, 30: 3000 },
  22: { 4: 300, 6: 540, 8: 840, 10: 1200, 12: 1400, 14: 1550, 16: 1750, 18: 2000, 20: 2200, 22: 2400, 24: 2600, 26: 2800, 28: 3000, 30: 3200 },
  24: { 4: 330, 6: 600, 8: 930, 10: 1400, 12: 1600, 14: 1750, 16: 1950, 18: 2200, 20: 2400, 22: 2600, 24: 2800, 26: 3000, 28: 3200, 30: 3400 },
  26: { 4: null, 6: 650, 8: 1020, 10: 1430, 12: 1750, 14: 1900, 16: 2150, 18: 2400, 20: 2600, 22: 2800, 24: 3000, 26: 3200, 28: 3400, 30: 3600 },
  28: { 4: null, 6: 710, 8: 1100, 10: 1550, 12: 1950, 14: 2100, 16: 2350, 18: 2600, 20: 2800, 22: 3000, 24: 3200, 26: 3400, 28: 3600, 30: 3800 },
  30: { 4: null, 6: 775, 8: 1200, 10: 1670, 12: 2150, 14: 2300, 16: 2550, 18: 2800, 20: 3000, 22: 3200, 24: 3400, 26: 3600, 28: 3800, 30: 4000 },
};

function getCfm(w: number, h: number): number | null {
  const row = CFM_CHART[w];
  if (!row) return null;
  const cfm = row[h];
  return cfm ?? null;
}

export function calculateDuctEquivalent(input: DuctulatorInput): DuctulatorResult {
  const { widthIn, heightIn, restrictionType, restrictionValueIn } = input;

  if (!widthIn || !heightIn || !restrictionValueIn || widthIn < 4 || widthIn > 30 || heightIn < 4 || heightIn > 30) {
    return {
      originalCFM: 0, originalWidth: widthIn, originalHeight: heightIn,
      restrictionType, restrictionValueIn,
      options: [],
      error: 'Enter valid even dimensions (4–30 in) and a restriction value.',
    };
  }

  const originalCFM = getCfm(widthIn, heightIn) ?? getCfm(heightIn, widthIn);
  if (originalCFM == null) {
    return {
      originalCFM: 0, originalWidth: widthIn, originalHeight: heightIn,
      restrictionType, restrictionValueIn,
      options: [],
      error: 'No CFM data for this size. Use even dimensions between 4 and 30 inches.',
    };
  }

  const options: DuctulatorOption[] = [];
  const origArea = widthIn * heightIn;

  for (let w = 4; w <= 30; w += 2) {
    for (let h = 4; h <= 30; h += 2) {
      if (restrictionType === 'max-width' && w > restrictionValueIn) continue;
      if (restrictionType === 'max-height' && h > restrictionValueIn) continue;
      const cfm = getCfm(w, h);
      if (cfm == null || cfm < originalCFM) continue;
      const area = w * h;
      options.push({ w, h, cfm, area, areaDiff: Math.abs(area - origArea) });
    }
  }

  options.sort((a, b) => a.areaDiff - b.areaDiff || a.area - b.area);

  return {
    originalCFM, originalWidth: widthIn, originalHeight: heightIn,
    restrictionType, restrictionValueIn,
    options: options.slice(0, 5),
  };
}
