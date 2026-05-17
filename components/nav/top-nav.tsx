'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import AuthModal from '@/components/auth/auth-modal';
import Button from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/calculator', label: 'Calculator' },
  { href: '/ductulator', label: 'Ductulator' },
  { href: '/ask-dan', label: 'Ask Dan' },
  { href: '/courses', label: 'Courses' },
  { href: '/products', label: 'Products' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { isLoggedIn, userEmail, openModal, handleLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userEmail ? userEmail[0].toUpperCase() : '';

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0">
              <span className="font-display text-xl font-black tracking-tight text-neutral-100">
                SMART<span className="text-orange-500">METAL</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
                    pathname === link.href
                      ? 'text-orange-500'
                      : 'text-neutral-400 hover:text-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white">
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Button size="sm" onClick={() => openModal('login')}>
                  Login
                </Button>
              )}
            </div>

            <button
              className="md:hidden text-neutral-400 hover:text-neutral-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-900 bg-[#0a0a0a]">
            <div className="px-4 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                    pathname === link.href ? 'text-orange-500' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-neutral-800">
                {isLoggedIn ? (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-sm font-bold uppercase tracking-wider text-neutral-500"
                  >
                    Logout ({userEmail})
                  </button>
                ) : (
                  <Button size="sm" onClick={() => { openModal('login'); setMobileOpen(false); }}>
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal />
    </>
  );
}
