export default function TrainerCard({ name, role, specialty, image, philosophy, dark = false }) {
  return (
    <div className={`group overflow-hidden rounded transition-all duration-500 ${
      dark
        ? 'bg-charcoal-card border border-border-dark hover:border-oak/30'
        : 'bg-white border border-border-light hover:shadow-md'
    }`}>
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-oak text-[10px] font-sans font-semibold tracking-[0.2em] uppercase mb-1">
            {role}
          </p>
          <h3 className="font-serif text-2xl text-white font-medium">
            {name}
          </h3>
          <p className="text-white/70 text-xs mt-1 font-sans tracking-wide">
            {specialty}
          </p>
        </div>
      </div>
      {philosophy && (
        <div className="p-5">
          <p className={`font-serif italic text-sm leading-relaxed ${
            dark ? 'text-text-warm' : 'text-text-muted'
          }`}>
            "{philosophy}"
          </p>
        </div>
      )}
    </div>
  );
}
