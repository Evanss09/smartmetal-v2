'use client';

import { useState } from 'react';
import { calculateDuctEquivalent } from '@/lib/ductulator';
import type { DuctulatorInput, DuctulatorResult } from '@/lib/types';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';

const EVEN_OPTIONS = Array.from({ length: 14 }, (_, i) => (i + 2) * 2);

const defaultInput: DuctulatorInput = {
  widthIn: 0,
  heightIn: 0,
  restrictionType: 'max-width',
  restrictionValueIn: 0,
};

export default function DuctulatorClient() {
  const [inputs, setInputs] = useState<DuctulatorInput>(defaultInput);
  const [result, setResult] = useState<DuctulatorResult | null>(null);
  const [error, setError] = useState('');

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { widthIn, heightIn, restrictionValueIn } = inputs;
    if (!widthIn || !heightIn || !restrictionValueIn) {
      setError('All fields are required.');
      return;
    }
    if (widthIn % 2 !== 0 || heightIn % 2 !== 0) {
      setError('Dimensions must be even numbers (4–30 in).');
      return;
    }
    const res = calculateDuctEquivalent(inputs);
    if (res.error) { setError(res.error); return; }
    setResult(res);
  }

  function reset() {
    setInputs(defaultInput);
    setResult(null);
    setError('');
  }

  const setField = (field: keyof DuctulatorInput, value: number | string) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-800">
      <div className="bg-[#0a0a0a] p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8">Original Duct</p>
        <form onSubmit={handleCalculate} className="flex flex-col gap-6">
          <Select
            label="Width (in)"
            id="width"
            value={inputs.widthIn || ''}
            onChange={(e) => setField('widthIn', Number(e.target.value))}
            required
          >
            <option value="">Select width</option>
            {EVEN_OPTIONS.map((v) => <option key={v} value={v}>{v}&quot;</option>)}
          </Select>
          <Select
            label="Height (in)"
            id="height"
            value={inputs.heightIn || ''}
            onChange={(e) => setField('heightIn', Number(e.target.value))}
            required
          >
            <option value="">Select height</option>
            {EVEN_OPTIONS.map((v) => <option key={v} value={v}>{v}&quot;</option>)}
          </Select>

          <div className="border-t border-neutral-800 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Space Constraint</p>
            <div className="flex flex-col gap-6">
              <Select
                label="Restrict By"
                id="restriction-type"
                value={inputs.restrictionType}
                onChange={(e) => setField('restrictionType', e.target.value as DuctulatorInput['restrictionType'])}
              >
                <option value="max-width">Max Width</option>
                <option value="max-height">Max Height</option>
              </Select>
              <Input
                label={`Max ${inputs.restrictionType === 'max-width' ? 'Width' : 'Height'} (in)`}
                id="restriction-value"
                type="number"
                min="4"
                max="30"
                step="2"
                placeholder="e.g. 12"
                value={inputs.restrictionValueIn || ''}
                onChange={(e) => setField('restrictionValueIn', Number(e.target.value))}
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" size="lg" className="w-full mt-2">Find Equivalents</Button>
        </form>
      </div>

      <div className="bg-[#0a0a0a] p-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Equivalent Sizes</p>
          {result && (
            <button
              onClick={reset}
              className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {!result ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center mb-4">
              <span className="text-2xl font-black text-neutral-700">?</span>
            </div>
            <p className="text-sm text-neutral-600">Fill in the inputs and hit Find Equivalents</p>
          </div>
        ) : result.options.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-sm text-neutral-500">No equivalent sizes found within that constraint.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="mb-2 px-4 py-2 bg-neutral-900 text-xs text-neutral-500">
              Original: {result.originalWidth}&quot; × {result.originalHeight}&quot; — {result.originalCFM} CFM
            </div>
            {result.options.map((opt, i) => (
              <div
                key={`${opt.w}x${opt.h}`}
                className={`flex items-center justify-between p-4 border ${i === 0 ? 'border-orange-500/40 bg-orange-500/5' : 'border-neutral-800'}`}
              >
                <div>
                  <span className="font-display text-lg font-black text-neutral-100">
                    {opt.w}&quot; × {opt.h}&quot;
                  </span>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-neutral-500">{opt.cfm} CFM</span>
                    <span className="text-xs text-neutral-600">·</span>
                    <span className="text-xs text-neutral-500">{opt.area} sq in</span>
                  </div>
                </div>
                <div className="text-right">
                  {i === 0 && <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Best Fit</div>}
                  <span className="text-xs text-neutral-600">
                    {opt.areaDiff === 0 ? 'Same area' : `±${opt.areaDiff} sq in`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
