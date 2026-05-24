export default function SectionHeading({ title, subtitle, align = 'center', dark = false }) {
  const alignment = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignment} mb-14`}>
      <h2 className={`font-serif text-4xl sm:text-5xl font-light tracking-tight ${
        dark ? 'text-white' : 'text-charcoal'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base max-w-2xl leading-relaxed ${
          align === 'center' ? 'mx-auto' : ''
        } ${dark ? 'text-text-warm' : 'text-text-muted'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 ${align === 'center' ? 'mx-auto' : ''} w-12 h-px ${
        dark ? 'bg-oak' : 'bg-oak'
      }`} />
    </div>
  );
}
