import { useReveal } from '../../hooks/useReveal';

export default function Section({ children, className = '', id, dark = false }) {
  const [ref, isVisible] = useReveal(0.1);

  return (
    <section
      id={id}
      ref={ref}
      className={`py-20 sm:py-28 ${
        dark ? 'bg-charcoal-deep text-white' : 'bg-alabaster text-charcoal'
      } ${className}`}
    >
      <div className={`reveal ${isVisible ? 'visible' : ''}`}>
        {children}
      </div>
    </section>
  );
}
