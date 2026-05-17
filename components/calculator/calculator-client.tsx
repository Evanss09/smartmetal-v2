'use client';

import { useState } from 'react';
import { Copy, Check, Minus, Plus } from 'lucide-react';
import { calculateMaterials, formatResultsText } from '@/lib/calculator';
import type { CalculatorInputs, CalculatorResults, MaterialLine } from '@/lib/types';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';

const defaultInputs: CalculatorInputs = {
  ductLengthFt: 0,
  ductType: 'TDF',
  supportType: 'Band Iron',
  ductSize: 'medium',
};

export default function CalculatorClient() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [lines, setLines] = useState<MaterialLine[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!inputs.ductLengthFt || inputs.ductLengthFt <= 0) {
      setError('Enter a duct length greater than 0.');
      return;
    }
    const result = calculateMaterials(inputs);
    if (result) {
      setResults(result);
      setLines(result.lines);
    }
  }

  function adjustQty(key: string, delta: number) {
    setLines((prev) =>
      prev.map((line) =>
        line.key === key ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line
      )
    );
  }

  async function handleCopy() {
    const text = formatResultsText(lines);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setInputs(defaultInputs);
    setResults(null);
    setLines([]);
    setError('');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-800">
      <div className="bg-[#0a0a0a] p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8">Inputs</p>
        <form onSubmit={handleCalculate} className="flex flex-col gap-6">
          <Input
            label="Duct Length (ft)"
            id="duct-length"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 200"
            value={inputs.ductLengthFt || ''}
            onChange={(e) => setInputs({ ...inputs, ductLengthFt: Number(e.target.value) })}
            required
          />
          <Select
            label="Duct Type"
            id="duct-type"
            value={inputs.ductType}
            onChange={(e) => setInputs({ ...inputs, ductType: e.target.value as CalculatorInputs['ductType'] })}
          >
            <option value="TDF">TDF</option>
            <option value="S&D">S&D</option>
            <option value="Round">Round</option>
          </Select>
          <Select
            label="Support Type"
            id="support-type"
            value={inputs.supportType}
            onChange={(e) => setInputs({ ...inputs, supportType: e.target.value as CalculatorInputs['supportType'] })}
          >
            <option value="Band Iron">Band Iron</option>
            <option value="Channel">Channel</option>
            <option value="Unistrut">Unistrut</option>
          </Select>
          <Select
            label="Duct Size"
            id="duct-size"
            value={inputs.ductSize}
            onChange={(e) => setInputs({ ...inputs, ductSize: e.target.value as CalculatorInputs['ductSize'] })}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </Select>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-2">
            Calculate
          </Button>
        </form>
      </div>

      <div className="bg-[#0a0a0a] p-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Materials Required</p>
          {results && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-orange-500 transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy All'}
              </button>
              <span className="text-neutral-700">|</span>
              <button
                onClick={reset}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {!results ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center mb-4">
              <span className="text-2xl font-black text-neutral-700">?</span>
            </div>
            <p className="text-sm text-neutral-600">Fill in the inputs and hit Calculate</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {lines.filter((l) => l.quantity > 0).map((line) => (
              <div
                key={line.key}
                className="flex items-center justify-between py-3 border-b border-neutral-900 last:border-0"
              >
                <span className="text-sm text-neutral-300">{line.label}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustQty(line.key, -getStep(line.key))}
                    className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-100 transition-colors"
                    aria-label={`Decrease ${line.label}`}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold text-neutral-100 w-20 text-right tabular-nums">
                    {line.quantity} {line.unit}
                  </span>
                  <button
                    onClick={() => adjustQty(line.key, getStep(line.key))}
                    className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-orange-500 transition-colors"
                    aria-label={`Increase ${line.label}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <p className="text-xs text-neutral-600">
                {results.ductType} · {results.supportType} · Quantities rounded to practical amounts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getStep(key: string): number {
  if (['kellyScrews', 'washers', 'nuts', 'nailIns', 'shots', 'carriageBolts'].includes(key)) return 50;
  if (['bandIron', 'channel', 'unistrut', 'threadedRod', 'gripple'].includes(key)) return 10;
  if (key === 'gasket') return 12;
  return 1;
}
