import type { Metadata } from 'next';
import AskDanClient from '@/components/ask-dan/ask-dan-client';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Ask Dan',
  description: 'Get expert sheet metal trade advice from Dan — a 40-year journeyman who knows HVAC ductwork inside and out.',
};

export default function AskDanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-10">
        <SectionLabel className="mb-3 block">AI Trade Expert</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-100 uppercase leading-none mb-4">
          Ask Dan
        </h1>
        <p className="text-neutral-500 max-w-xl">
          Dan&apos;s been in the sheet metal trade for 40 years. Ask him about ductwork, materials, fittings, sizing — anything on the job.
          <span className="text-orange-500 font-bold"> Sign in to start chatting.</span>
        </p>
      </div>
      <AskDanClient />
    </div>
  );
}
