import type { CalculatorInputs, CalculatorResults, MaterialLine } from './types';

function roundValue(key: string, value: number): number {
  let v = value;
  switch (key) {
    case 'kellyScrews':
    case 'washers':
    case 'nailIns':
    case 'nuts':
      v = Math.ceil(v / 50) * 50;
      break;
    case 'gasket':
      v = v <= 12 ? 12 : Math.ceil(v / 12) * 12;
      break;
    case 'bandIron':
    case 'channel':
    case 'unistrut':
    case 'threadedRod':
      v = Math.ceil(v / 10) * 10;
      break;
    case 'gripple':
      v = Math.ceil(v / 10) * 10;
      break;
    default:
      v = Math.ceil(v);
  }
  return v;
}

export function calculateMaterials(input: CalculatorInputs): CalculatorResults | null {
  const { ductLengthFt, ductType, supportType, ductSize } = input;
  if (!ductLengthFt || !ductType || !supportType || !ductSize) return null;

  const sizeMultiplier = ductSize === 'small' ? 0.8 : ductSize === 'large' ? 1.5 : 1;
  const per50 = ductLengthFt / 50;

  const raw: Record<string, number> = {
    kellyScrews: per50 * 200,
    bandIron: per50 * 80,
    channel: per50 * 20,
    unistrut: per50 * 20,
    washers: per50 * 40,
    nuts: per50 * (ductType === 'TDF' ? 100 : 40),
    carriageBolts: ductType === 'TDF' ? per50 * 60 : 0,
    ductSealer: per50,
    ductSealBrush: per50,
    nailIns: supportType === 'Band Iron' ? per50 * 30 : 0,
    shots: (supportType === 'Channel' || supportType === 'Unistrut') ? per50 * 30 : 0,
    gasket: per50 * 3,
    gripple: ductType === 'Round' ? per50 * 10 : 0,
    threadedRod: (supportType === 'Channel' || supportType === 'Unistrut') ? per50 * 80 : 0,
  };

  const rounded: Record<string, number> = {};
  Object.keys(raw).forEach((k) => {
    rounded[k] = roundValue(k, raw[k] * sizeMultiplier);
  });

  const lines: MaterialLine[] = [];

  lines.push({ key: 'kellyScrews', label: '5/16" Kelley Screws', quantity: rounded.kellyScrews, unit: 'pcs' });

  if (supportType === 'Band Iron') {
    lines.push({ key: 'bandIron', label: 'Band Iron', quantity: rounded.bandIron, unit: 'ft' });
    lines.push({ key: 'nailIns', label: '1/4" Nail-ins', quantity: rounded.nailIns, unit: 'pcs' });
  }
  if (supportType === 'Channel') {
    lines.push({ key: 'channel', label: 'Channel', quantity: rounded.channel, unit: 'ft' });
    lines.push({ key: 'shots', label: '3/8" Shots', quantity: rounded.shots, unit: 'pcs' });
    lines.push({ key: 'threadedRod', label: '3/8" Threaded Rod', quantity: rounded.threadedRod, unit: 'ft' });
    lines.push({ key: 'nuts', label: '3/8" Nuts', quantity: rounded.nuts, unit: 'pcs' });
  }
  if (supportType === 'Unistrut') {
    lines.push({ key: 'unistrut', label: 'Slotted Unistrut', quantity: rounded.unistrut, unit: 'ft' });
    lines.push({ key: 'shots', label: '3/8" Shots', quantity: rounded.shots, unit: 'pcs' });
    lines.push({ key: 'threadedRod', label: '3/8" Threaded Rod', quantity: rounded.threadedRod, unit: 'ft' });
    lines.push({ key: 'nuts', label: '3/8" Nuts', quantity: rounded.nuts, unit: 'pcs' });
  }

  if (ductType !== 'Round') {
    lines.push({ key: 'washers', label: '3/8" Washers', quantity: rounded.washers, unit: 'pcs' });
    lines.push({ key: 'gasket', label: 'Gasket', quantity: rounded.gasket, unit: 'rolls' });
  }

  if (ductType === 'TDF' && rounded.carriageBolts > 0) {
    lines.push({ key: 'carriageBolts', label: '3/8" Carriage Bolts', quantity: rounded.carriageBolts, unit: 'pcs' });
  }

  lines.push({ key: 'ductSealer', label: 'Duct Sealer', quantity: rounded.ductSealer, unit: 'pail(s)' });
  lines.push({ key: 'ductSealBrush', label: 'Duct Seal Brush', quantity: rounded.ductSealBrush, unit: 'pcs' });

  if (ductType === 'Round' && rounded.gripple > 0) {
    lines.push({ key: 'gripple', label: "5' Gripple", quantity: rounded.gripple, unit: 'pcs' });
  }

  return { lines, ductType, supportType };
}

export function formatResultsText(lines: MaterialLine[]): string {
  const header = 'Materials Required:';
  const body = lines
    .filter((l) => l.quantity > 0)
    .map((l) => `- ${l.label}: ${l.quantity} ${l.unit}`)
    .join('\n');
  return `${header}\n${body}`;
}
