import { Award, Quote } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import { instructors } from '../data';

export default function Instructors() {
  const [headerRef, headerVisible] = useReveal(0.1);

  return (
    <>
      {/* Page Header */}
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div ref={headerRef} className={`max-w-2xl reveal ${headerVisible ? 'visible' : ''}`}>
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Our Team
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Guided by <em className="text-oak">passion</em>
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-lg">
              Our instructors are more than teachers — they are guides, mentors, and fellow
              practitioners who share your journey toward strength and balance.
            </p>
          </div>
        </Container>
      </section>

      {/* Instructors Detail */}
      <section className="bg-alabaster py-16 sm:py-24">
        <Container>
          <div className="space-y-16 sm:space-y-24">
            {instructors.map((instructor, index) => (
              <InstructorRow key={instructor.id} instructor={instructor} reverse={index % 2 !== 0} />
            ))}
          </div>
        </Container>
      </section>

      {/* Join CTA */}
      <section className="bg-charcoal-deep py-16 sm:py-20">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Join Our Team
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Interested in teaching with us?
            </h2>
            <p className="mt-4 text-text-warm text-sm leading-relaxed">
              We're always looking for passionate, certified instructors who share our
              commitment to mindful movement and creating safe, empowering spaces for women.
            </p>
            <div className="mt-8">
              <Button variant="oak">Get in Touch</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function InstructorRow({ instructor, reverse }) {
  const [ref, isVisible] = useReveal(0.15);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        reverse ? 'lg:direction-rtl' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${reverse ? 'lg:order-2' : ''}`}>
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-full h-[450px] sm:h-[520px] object-cover rounded"
        />
        {/* Warm glow */}
        <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-amber/15 rounded-full blur-2xl" />
      </div>

      {/* Info */}
      <div className={`${reverse ? 'lg:order-1' : ''}`}>
        <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.3em] uppercase mb-3">
          {instructor.role}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal tracking-tight mb-2">
          {instructor.name}
        </h2>
        <p className="font-sans text-text-muted text-xs tracking-wider mb-6">
          {instructor.specialty}
        </p>

        <p className="text-text-muted leading-relaxed mb-8">
          {instructor.bio}
        </p>

        {/* Philosophy Quote */}
        {instructor.philosophy && (
          <div className="bg-charcoal-deep rounded p-6 mb-8">
            <Quote size={18} className="text-oak mb-3" />
            <p className="font-serif italic text-white text-lg leading-relaxed">
              {instructor.philosophy}
            </p>
          </div>
        )}

        {/* Certifications */}
        {instructor.certifications && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} className="text-oak" />
              <h4 className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-charcoal">
                Certifications
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {instructor.certifications.map((cert, i) => (
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
