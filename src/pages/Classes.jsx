import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import ClassOfferCard from '../components/cards/ClassOfferCard';
import { classCatalogByLevel } from '../data';

export default function Classes() {
  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Classes & Pricing
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Train by <em className="text-oak">level</em>, progress with clarity
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-2xl">
              Explore our class catalog grouped by Beginner, Intermediate, and Advanced levels. Every class includes transparent pricing and a direct booking path.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-14 sm:py-20">
        <Container>
          <div className="space-y-14 sm:space-y-16">
            {classCatalogByLevel.map((group) => (
              <LevelSection key={group.level} group={group} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-charcoal-deep py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Need help choosing?
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Start with a guided booking
            </h2>
            <p className="mt-4 text-text-warm text-sm sm:text-base leading-relaxed">
              If you are unsure about your level, we will place you in the right class after a quick intake at booking.
            </p>
            <div className="mt-8">
              <Link to="/booking">
                <Button variant="oak" size="lg">
                  Go to Booking
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function LevelSection({ group }) {
  return (
    <section>
      <SectionHeading
        title={`${group.level} Level`}
        subtitle={group.intro}
        align="left"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {group.offers.map((offer) => (
          <ClassOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
