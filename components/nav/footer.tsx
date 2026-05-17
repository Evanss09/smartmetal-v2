'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong. Try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <footer className="border-t border-neutral-900 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <span className="font-display text-2xl font-black tracking-tight text-neutral-100">
              SMART<span className="text-orange-500">METAL</span>
            </span>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs">
              Tools and resources built for sheet metal workers. No fluff, just what you need on the job.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { href: '/calculator', label: 'Calculator' },
                { href: '/ductulator', label: 'Ductulator' },
                { href: '/ask-dan', label: 'Ask Dan' },
                { href: '/courses', label: 'Courses' },
                { href: '/products', label: 'Products' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">
              Stay in the Loop
            </p>
            <h3 className="font-display text-2xl font-black text-neutral-100 mb-2">
              Updates for Tradespeople
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              No spam. Useful updates for sheet metal workers only.
            </p>

            {status === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/30 px-4 py-4">
                <p className="text-sm font-bold text-green-400">You&apos;re in. We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  label="Name"
                  id="footer-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={status === 'error' ? errorMsg : undefined}
                />
                <Button type="submit" disabled={status === 'loading'} className="w-full mt-1">
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} SmartMetal. Built for the trades.
          </p>
        </div>
      </div>
    </footer>
  );
}
