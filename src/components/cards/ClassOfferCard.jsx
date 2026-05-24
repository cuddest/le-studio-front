import { Link } from 'react-router-dom';
import { Clock3, UserRound, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ClassOfferCard({ offer }) {
  return (
    <article className="group bg-white border border-border-light rounded overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/70 to-transparent" />
        <span className="absolute top-4 left-4 bg-charcoal-deep/85 text-white text-[10px] font-sans tracking-[0.2em] uppercase px-3 py-1.5 rounded">
          {offer.discipline}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-2xl text-charcoal mb-2">{offer.title}</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-4">{offer.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs text-text-muted mb-5">
          <p className="flex items-center gap-1.5"><Clock3 size={12} className="text-oak" />{offer.duration}</p>
          <p className="flex items-center gap-1.5"><UserRound size={12} className="text-oak" />{offer.coach}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border-light pt-4 mb-5">
          <div>
            <p className="font-sans text-[10px] text-text-muted tracking-[0.2em] uppercase">Pricing</p>
            <p className="font-serif text-2xl text-charcoal">
              {offer.price} <span className="text-sm text-text-muted">DA</span>
            </p>
          </div>
          <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-oak">per class</span>
        </div>

        <Link to="/booking">
          <Button className="w-full" size="sm">
            Book Now
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </article>
  );
}
