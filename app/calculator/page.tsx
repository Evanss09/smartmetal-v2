import type { Metadata } from 'next';
import CalculatorClient from '@/components/calculator/calculator-client';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Material Calculator',
  description: 'Calculate exact material quantities for sheet metal ductwork — screws, rod, sealer, gasket, and more.',
};

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-12">
        <SectionLabel className="mb-3 block">Tool</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-100 uppercase leading-none mb-4">
          Material Calculator
        </h1>
        <p className="text-neutral-500 max-w-xl">
          Enter your duct specs. Get an exact supplier list — quantities calculated, rounded to practical amounts, ready to copy.
        </p>
      </div>
      <CalculatorClient />
    </div>
  );
}
