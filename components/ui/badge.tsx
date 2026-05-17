interface BadgeProps {
  variant: 'sold-out' | 'coming-soon' | 'available';
  className?: string;
}

const variants = {
  'sold-out': 'bg-neutral-800 text-neutral-500',
  'coming-soon': 'bg-orange-500/20 text-orange-400',
  'available': 'bg-green-500/20 text-green-400',
};

export default function Badge({ variant, className = '' }: BadgeProps) {
  const labels = {
    'sold-out': 'Sold Out',
    'coming-soon': 'Coming Soon',
    'available': 'Available',
  };

  return (
    <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 ${variants[variant]} ${className}`}>
      {labels[variant]}
    </span>
  );
}
