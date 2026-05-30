import { Link } from 'react-router-dom';
import { ArrowRight, Clock3 } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';

export default function WeeklyPlanningSection({ weekSchedule = [] }) {
  return (
    <section className="bg-alabaster py-20 sm:py-24">
      <Container>
        <div className="rounded border border-border-light bg-white p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <SectionHeading
              title="Weekly Planning"
              subtitle="A quick glance at this week. Tap in and reserve your slot."
              align="left"
            />
            <Link
              to="/classes"
              className="inline-flex items-center gap-2 text-oak text-xs font-sans font-medium tracking-[0.15em] uppercase hover:text-oak-dark transition-colors"
            >
              View Full Schedule
              <ArrowRight size={14} />
            </Link>
          </div>

          <Link to="/classes" className="block">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weekSchedule.map((day) => (
                <div
                  key={day.day}
                  className="rounded border border-border-light/80 bg-alabaster px-4 py-4 hover:border-oak/35 hover:bg-alabaster-dark transition-colors"
                >
                  <p className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-oak mb-2">
                    {day.day}
                  </p>
                  <p className="font-serif text-xl text-charcoal mb-1">{day.theme}</p>
                  <p className="text-text-muted text-xs flex items-center gap-1.5">
                    <Clock3 size={12} />
                    {day.window}
                  </p>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
