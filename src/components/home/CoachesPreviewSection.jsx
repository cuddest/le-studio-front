import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';

export default function CoachesPreviewSection({ coaches = [] }) {
  return (
    <section className="bg-charcoal-deep py-16 sm:py-20">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            title="Coaches"
            subtitle="Meet the women guiding every session with intention and expertise."
            align="left"
            dark
          />
          <Link
            to="/coaches"
            className="inline-flex items-center gap-2 text-oak text-xs font-sans font-medium tracking-[0.15em] uppercase hover:text-oak-light transition-colors shrink-0"
          >
            Full Roster
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-5 sm:gap-6">
          {coaches.map((coach) => (
            <Link key={coach.id} to="/coaches" className="group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/20 overflow-hidden transition-all duration-300 group-hover:border-oak group-hover:scale-[1.03]">
                <img
                  src={coach.image}
                  alt={coach.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-center text-[10px] font-sans tracking-[0.2em] uppercase text-text-warm group-hover:text-oak transition-colors">
                {coach.name.split(' ')[0]}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
