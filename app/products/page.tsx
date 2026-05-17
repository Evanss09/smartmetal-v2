import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Specialty tools and equipment engineered for the sheet metal trade.',
};

const PRODUCTS = [
  {
    id: 'hanger-buddy',
    title: 'Hanger Buddy',
    description: 'The ultimate tool for fast, accurate duct hanger installation. Save time, reduce errors, and work smarter on every run.',
    status: 'coming_soon' as const,
  },
  {
    id: 'specialty-hammer',
    title: 'Specialty Hammer',
    description: 'Engineered for sheet metal work: perfect balance, unique head design, and an ergonomic grip for all-day comfort.',
    status: 'coming_soon' as const,
  },
  {
    id: 'duct-sizer',
    title: 'Duct Sizer',
    description: 'Quickly and accurately size ducts on the job. Compact, durable, and designed for real-world use — no phone required.',
    status: 'coming_soon' as const,
  },
  {
    id: 'more-tools',
    title: 'More Tools Coming',
    description: "We're always building. Stay tuned for more specialty tools and accessories from SmartMetal.",
    status: 'coming_soon' as const,
  },
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-16">
        <SectionLabel className="mb-3 block">Equipment</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-100 uppercase leading-none mb-4">
          Products
        </h1>
        <p className="text-neutral-500 max-w-xl">
          Specialty tools engineered for sheet metal workers. Not sold in hardware stores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="group bg-[#0a0a0a] hover:bg-surface transition-colors duration-200 p-8 flex flex-col">
            <div className="flex-1">
              <div className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 bg-orange-500/10 text-orange-500 mb-4">
                Coming Soon
              </div>
              <h2 className="font-display text-2xl font-black text-neutral-100 uppercase mb-3">
                {product.title}
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">{product.description}</p>
            </div>
            <div className="mt-8">
              <Button variant="secondary" disabled className="w-full">
                <span>Notify Me</span>
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
