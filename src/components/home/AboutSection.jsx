import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import { useReveal } from '../../hooks/useReveal';

export default function AboutSection({ quote, description, image }) {
  const [ref, isVisible] = useReveal(0.12);

  return (
    <section className="bg-alabaster py-20 sm:py-28">
      <Container>
        <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center reveal ${isVisible ? 'visible' : ''}`}>
          <div>
            <SectionHeading
              title="About Us"
              subtitle="Le Studio Contrology is a women-first movement space where precision, breath, and consistency shape confidence from the inside out."
              align="left"
            />
            <blockquote className="border-l-2 border-oak pl-5 mb-6">
              <p className="font-serif text-2xl sm:text-3xl italic text-charcoal leading-snug">
                "{quote}"
              </p>
            </blockquote>
            <p className="text-text-muted leading-relaxed">
              {description}
            </p>
          </div>

          <div className="relative">
            <img
              src={image}
              alt="Studio class"
              className="w-full h-[430px] sm:h-[500px] object-cover rounded"
              loading="lazy"
            />
            <div className="absolute -bottom-3 -right-3 w-28 h-28 rounded-full bg-amber/20 blur-2xl" />
          </div>
        </div>
      </Container>
    </section>
  );
}
