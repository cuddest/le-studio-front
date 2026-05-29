import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import ClassOfferCard from '../components/cards/ClassOfferCard';
import { fetchClassCatalog } from '../services/classesService';

export default function Classes() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClassCatalog();
        setCatalog(data);
      } catch (err) {
        console.error('Failed to load class catalog:', err);
        setError('Unable to load classes. Please try again later.');
        setCatalog([]);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

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
          {loading && (
            <div className="text-center py-12">
              <p className="text-text-warm">Loading classes...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-center mb-8">
              {error}
            </div>
          )}

          {!loading && !error && catalog.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-warm">No classes available at the moment. Please check back soon.</p>
            </div>
          )}

          {!loading && !error && catalog.length > 0 && (
            <div className="space-y-14 sm:space-y-16">
              {catalog.map((group) => (
                <LevelSection key={group.level} group={group} />
              ))}
            </div>
          )}
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
