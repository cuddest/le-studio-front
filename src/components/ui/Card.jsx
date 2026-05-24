export default function Card({ children, className = '', dark = false, ...props }) {
  return (
    <div
      className={`rounded p-6 sm:p-8 transition-all duration-300 ${
        dark
          ? 'bg-charcoal-card border border-border-dark'
          : 'bg-white border border-border-light shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
