import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';

export default function FaqSection({ items = [] }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <section className="bg-charcoal-deep py-20 sm:py-24">
      <Container>
        <SectionHeading
          title="FAQ"
          subtitle="Everything you need before your first class."
          dark
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item) => {
            const isOpen = item.id === openId;
            return (
              <article key={item.id} className="rounded border border-border-dark bg-charcoal-card overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 cursor-pointer"
                >
                  <span className="font-sans text-sm sm:text-base font-medium text-white tracking-wide">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-oak shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <p className="text-text-warm text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
