interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`text-xs font-bold uppercase tracking-widest text-orange-500 ${className}`}>
      {children}
    </span>
  );
}
