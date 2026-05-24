export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base =
    'font-sans font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2';

  const sizes = {
    sm: 'px-5 py-2.5 text-[11px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4 text-sm',
  };

  const variants = {
    primary:
      'bg-charcoal-deep text-white hover:bg-oak hover:text-charcoal-deep active:scale-[0.97] rounded',
    oak:
      'bg-oak text-charcoal-deep hover:bg-oak-dark active:scale-[0.97] rounded',
    outline:
      'border border-charcoal-deep text-charcoal-deep hover:bg-charcoal-deep hover:text-white rounded',
    outlineLight:
      'border border-white/30 text-white hover:border-oak hover:text-oak rounded',
    ghost:
      'text-text-muted hover:text-oak',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
