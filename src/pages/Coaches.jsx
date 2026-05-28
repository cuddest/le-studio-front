import { Award, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import { useEffect, useState } from 'react';
import { listCoaches } from '../services/coachService';

export default function Coaches() {
  const [headerRef, headerVisible] = useReveal(0.1);

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listCoaches()
      .then((data) => {
        if (mounted) setCoaches(data || []);
      })
      .catch(() => {
        if (mounted) setCoaches([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div ref={headerRef} className={`max-w-2xl reveal ${headerVisible ? 'visible' : ''}`}>
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Coaching Team
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Coaches who lead with <em className="text-oak">precision</em>
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-lg">
              Meet the women behind every class. Each coach brings a distinct method, deep training, and a shared commitment to safe, progressive movement.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-16 sm:py-24">
        <Container>
          <div className="space-y-16 sm:space-y-24">
            {loading ? (
              <p className="text-center text-text-muted">Loading coaches…</p>
            ) : (
              (coaches || []).map((coach, index) => (
                <CoachRow key={coach.id || index} coach={coach} reverse={index % 2 !== 0} />
              ))
            )}
          </div>
        </Container>
      </section>

      <section className="bg-charcoal-deep py-16 sm:py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Train With Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Ready to train with your coach?
            </h2>
            <p className="mt-4 text-text-warm text-sm leading-relaxed">
              Book your next class and choose the training style that fits your current level and goals.
            </p>
            <div className="mt-8">
              <Link to="/booking">
                <Button variant="oak">Book a Session</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function CoachRow({ coach, reverse }) {
  const [ref, isVisible] = useReveal(0.15);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}
    >
      <div className={`relative ${reverse ? 'lg:order-2' : ''}`}>
        <img
          src={coach.image}
          alt={coach.name}
          className="w-full h-112.5 sm:h-130 object-cover rounded"
        />
        <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-amber/15 rounded-full blur-2xl" />
      </div>

      <div className={`${reverse ? 'lg:order-1' : ''}`}>
        <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.3em] uppercase mb-3">
          {coach.role}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal tracking-tight mb-2">
          {coach.name}
        </h2>
        <p className="font-sans text-text-muted text-xs tracking-wider mb-6">
          {coach.specialty}
        </p>

        <p className="text-text-muted leading-relaxed mb-8">
          {coach.bio}
        </p>

        {coach.philosophy && (
          <div className="bg-charcoal-deep rounded p-6 mb-8">
            <Quote size={18} className="text-oak mb-3" />
            <p className="font-serif italic text-white text-lg leading-relaxed">
              {coach.philosophy}
            </p>
          </div>
        )}

        {coach.certifications && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} className="text-oak" />
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-charcoal">
                Certifications
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {coach.certifications.map((cert, i) => (
                <span
                  key={i}
                  className="bg-alabaster-dark text-text-muted text-[11px] font-sans tracking-wide px-3 py-1.5 rounded border border-border-light"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
