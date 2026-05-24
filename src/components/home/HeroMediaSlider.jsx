import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { useReveal } from '../../hooks/useReveal';
import { useMediaSlider } from '../../hooks/useMediaSlider';

export default function HeroMediaSlider({ slides = [] }) {
  const [contentRef, contentVisible] = useReveal(0.05);
  const { activeIndex, activeItem, hasItems, hasMany, next, prev, goTo } = useMediaSlider(slides, 6500);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal-deep">
      <div className="absolute inset-0">
        {hasItems && slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={!isActive}
            >
              {slide.type === 'video' ? (
                <video
                  className="w-full h-full object-cover"
                  src={slide.url}
                  poster={slide.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={slide.url}
                  alt={slide.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-deep/90 via-charcoal-deep/70 to-amber/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-transparent to-charcoal-deep/40" />
      </div>

      <Container className="relative z-10">
        <div ref={contentRef} className={`max-w-3xl reveal ${contentVisible ? 'visible' : ''}`}>
          <p className="font-sans text-oak text-[11px] font-semibold tracking-[0.4em] uppercase mb-7">
            {activeItem?.eyebrow || 'Women-Only Studio · Algiers'}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[5.5rem] font-light text-white leading-[1.05] tracking-tight">
            {activeItem?.title || 'Strength in control,'}
            <span className="block mt-2 text-oak">{activeItem?.accent || 'beauty in flow.'}</span>
          </h1>
          <p className="mt-7 text-text-warm text-base sm:text-lg max-w-xl leading-relaxed font-light">
            {activeItem?.description ||
              'A sanctuary for mindful movement in the heart of Algiers. Reformer Pilates, Hot Yoga, and breathwork designed for women who seek strength through intention.'}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={activeItem?.primaryLink || '/booking'}>
              <Button variant="oak" size="lg">
                {activeItem?.primaryLabel || 'Book a Session'}
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to={activeItem?.secondaryLink || '/classes'}>
              <Button variant="outlineLight" size="lg">
                {activeItem?.secondaryLabel || 'Discover Our Classes'}
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {hasMany && (
        <>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === activeIndex ? 'w-8 bg-oak' : 'w-3 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute right-4 sm:right-8 bottom-8 z-20 flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded border border-white/25 text-white/80 hover:text-oak hover:border-oak transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="mx-auto" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded border border-white/25 text-white/80 hover:text-oak hover:border-oak transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="mx-auto" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
