import type { Metadata } from 'next';
import DuctulatorClient from '@/components/ductulator/ductulator-client';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Ductulator',
  description: 'Find equivalent rectangular duct sizes when space constraints prevent your original duct dimensions.',
};

export default function DuctulatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-12">
        <SectionLabel className="mb-3 block">Tool</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-100 uppercase leading-none mb-4">
          Ductulator
        </h1>
        <p className="text-neutral-500 max-w-xl">
          Can&apos;t fit the original duct? Enter your dimensions and space constraint to find the top 5 equivalent sizes that meet or exceed the original CFM.
        </p>
      </div>
      <DuctulatorClient />
    </div>
  );
}
