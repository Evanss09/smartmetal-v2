import Link from 'next/link';
import Button from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
      <span className="font-display text-8xl font-black text-orange-500 leading-none mb-4">404</span>
      <h1 className="font-display text-3xl font-black text-neutral-100 uppercase mb-4">Page Not Found</h1>
      <p className="text-neutral-500 mb-10 max-w-sm">
        That page doesn&apos;t exist. Try one of the tools below.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/"><Button>Back to Home</Button></Link>
        <Link href="/calculator"><Button variant="secondary">Material Calculator</Button></Link>
      </div>
    </div>
  );
}
