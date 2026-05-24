import Button from '../ui/Button';
import { Clock, User, Users } from 'lucide-react';

export default function ClassCard({ title, discipline, instructor, time, duration, image, level, spots, spotsLeft, dark = false }) {
  const isFull = spotsLeft === 0;

  return (
    <div className={`group overflow-hidden rounded transition-all duration-500 ${
      dark
        ? 'bg-charcoal-card border border-border-dark hover:border-oak/30'
        : 'bg-white border border-border-light hover:shadow-md'
    }`}>
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {level && (
          <span className="absolute top-4 left-4 bg-charcoal-deep/80 backdrop-blur-sm text-white text-[10px] font-sans font-medium tracking-wider uppercase px-3 py-1.5 rounded">
            {level}
          </span>
        )}
        {isFull && (
          <span className="absolute top-4 right-4 bg-oak/90 text-charcoal-deep text-[10px] font-sans font-semibold tracking-wider uppercase px-3 py-1.5 rounded">
            Full
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6">
        {discipline && (
          <p className="text-oak text-[10px] font-sans font-semibold tracking-[0.2em] uppercase mb-2">
            {discipline}
          </p>
        )}
        <h3 className={`font-serif text-xl font-medium mb-3 ${
          dark ? 'text-white' : 'text-charcoal'
        }`}>
          {title}
        </h3>
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-5 ${
          dark ? 'text-text-warm' : 'text-text-muted'
        }`}>
          {instructor && (
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {instructor}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {time} · {duration}
          </span>
          {spots && (
            <span className="flex items-center gap-1.5">
              <Users size={12} />
              {isFull ? 'Waitlist' : `${spotsLeft}/${spots} spots`}
            </span>
          )}
        </div>
        <Button
          variant={dark ? 'outlineLight' : 'outline'}
          size="sm"
          className="w-full"
          disabled={isFull}
        >
          {isFull ? 'Join Waitlist' : 'Reserve Spot'}
        </Button>
      </div>
    </div>
  );
}
