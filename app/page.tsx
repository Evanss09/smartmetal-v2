import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, Wind, MessageSquare, BookOpen, Wrench, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'SmartMetal — Tools for Sheet Metal Workers',
  description: 'Material calculators, duct sizing tools, and expert AI trade advice built for sheet metal workers in the field.',
};

const FEATURES = [
  {
    icon: Calculator,
    href: '/calculator',
    title: 'Material Calculator',
    description: 'Enter your duct specs and get an exact materials list — screws, rod, sealer, gasket — ready to copy and send to your supplier.',
    tag: 'Tool',
  },
  {
    icon: Wind,
    href: '/ductulator',
    title: 'Ductulator',
    description: "Can't fit the original size? Enter your constraint and get the top 5 equivalent rectangular duct sizes that still hit the required CFM.",
    tag: 'Tool',
  },
  {
    icon: MessageSquare,
    href: '/ask-dan',
    title: 'Ask Dan',
    description: "Dan's a 40-year sheet metal journeyman. Ask him anything about ductwork, fittings, materials, or jobsite problems.",
    tag: 'AI',
  },
];

const SECONDARY = [
  { icon: BookOpen, href: '/courses', title: 'Courses', description: 'Trade courses built for sheet metal workers — from CofQ prep to leadership.' },
  { icon: Wrench, href: '/products', title: 'Products', description: 'Specialty tools engineered for the sheet metal trade.' },
];

const STATS = [
  { value: '40+', label: 'Years of combined trade experience behind the tools' },
  { value: '3', label: 'Purpose-built tools designed for the field, not the office' },
  { value: '0', label: 'Generic advice. Everything here is trade-specific.' },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute inset-0 orange-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 lg:py-48">
          <div className="max-w-3xl">
            <SectionLabel className="mb-6 block">Sheet Metal Trades</SectionLabel>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-neutral-100 leading-none tracking-tight uppercase mb-6">
              The Trades Are Changing.<br />
              <span className="text-orange-500">Get Ahead of It.</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-10 max-w-xl leading-relaxed">
              Calculators, sizing tools, and real trade expertise — built for sheet metal workers who take their work seriously.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/calculator">
                <Button size="lg">Start Calculating</Button>
              </Link>
              <Link href="/ask-dan">
                <Button size="lg" variant="secondary">Ask Dan</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <SectionLabel className="mb-3 block">Core Tools</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-100 uppercase">
            Built for the Field
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group bg-[#0a0a0a] p-8 hover:bg-surface transition-colors duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center">
                    <Icon size={20} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-neutral-500 transition-colors">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-black text-neutral-100 uppercase mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed flex-1">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-wider">
                  Open Tool <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-neutral-900 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {STATS.map((stat) => (
              <div key={stat.value}>
                <div className="font-display text-5xl font-black text-orange-500 mb-2">{stat.value}</div>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <SectionLabel className="mb-3 block">More from SmartMetal</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-neutral-100 uppercase">
            Coming Up
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
          {SECONDARY.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-[#0a0a0a] hover:bg-surface transition-colors duration-200 p-8 flex items-start gap-6"
              >
                <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black text-neutral-100 uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
