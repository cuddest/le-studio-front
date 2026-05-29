import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3, UserRound, Users, Activity } from 'lucide-react';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import { fetchSchedulesWithSlots } from '../services/classesService';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toDayIndex(slot) {
  if (Number.isInteger(slot.dayOfWeek)) {
    return slot.dayOfWeek;
  }
  const dateSource = slot.date || slot.startTime || slot.start_time;
  const d = new Date(dateSource);
  if (!Number.isNaN(d.getTime())) {
    return d.getDay();
  }
  return -1;
}

function formatClock(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'TBA';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDateLabel(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'No date';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function slotSort(a, b) {
  const da = new Date(a.startTime || a.start_time || a.date || 0).getTime();
  const db = new Date(b.startTime || b.start_time || b.date || 0).getTime();
  return da - db;
}

export default function Classes() {
  const [catalog, setCatalog] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // `catalog` holds schedules with slots
  const schedules = catalog;
  const allOffers = schedules.flatMap((s) => s.slots || []);
  const levels = ['all', ...Array.from(new Set(allOffers.map((o) => o.level || 'All Levels'))).filter(Boolean)];
  const filteredOffers = selectedLevel === 'all'
    ? allOffers
    : allOffers.filter((slot) => (slot.level || 'All Levels') === selectedLevel);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSchedulesWithSlots();
        setCatalog(data);
      } catch (err) {
        console.error('Failed to load class catalog:', err);
        setError('Unable to load classes. Please try again later.');
        setCatalog([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
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
              Weekly <em className="text-oak">schedule</em>, all sessions in one place
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-2xl">
              Browse the full week exactly as configured in the schedule tables, with every session detail: time, coach, discipline, level, capacity, and booking status.
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
            <>
              <div className="mb-8 flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-full border text-xs tracking-[0.16em] uppercase transition-colors ${
                      selectedLevel === level
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-text-muted border-border-light hover:border-charcoal'
                    }`}
                  >
                    {level === 'all' ? 'All Levels' : level}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {schedules.map((schedule) => {
                  const slots = (schedule.slots || []).filter((slot) =>
                    selectedLevel === 'all' ? true : (slot.level || 'All Levels') === selectedLevel
                  );
                  const slotsByDay = DAY_NAMES.map((name, index) => ({
                    name,
                    index,
                    items: slots.filter((slot) => toDayIndex(slot) === index).sort(slotSort),
                  }));
                  return (
                    <section key={schedule.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif text-3xl text-charcoal">{schedule.title}</h2>
                        <div className="text-text-muted text-sm">
                          {schedule.weekStart ? `${formatDateLabel(schedule.weekStart)} → ${formatDateLabel(schedule.weekEnd)}` : ''}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {slotsByDay.map((day) => (
                          <DayScheduleSection key={`${schedule.id}-${day.name}`} day={day} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
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

function DayScheduleSection({ day }) {
  if (!day.items.length) {
    return (
      <section className="bg-white border border-border-light rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-charcoal">{day.name}</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-text-muted">No sessions</span>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-border-light rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-charcoal-deep text-white flex items-center justify-between">
        <h3 className="font-serif text-2xl">{day.name}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-oak">{day.items.length} Sessions</span>
      </div>

      <div className="divide-y divide-border-light">
        {day.items.map((slot) => (
          <article key={slot.id} className="p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h4 className="font-serif text-2xl text-charcoal">{slot.title}</h4>
                <p className="text-text-muted mt-1">{slot.discipline}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-alabaster text-[10px] tracking-[0.16em] uppercase text-text-muted border border-border-light">
                  {slot.level || 'All Levels'}
                </span>
                {slot.isCancelled ? (
                  <span className="px-3 py-1 rounded-full bg-red-50 text-[10px] tracking-[0.16em] uppercase text-red-700 border border-red-200">
                    Cancelled
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-green-50 text-[10px] tracking-[0.16em] uppercase text-green-700 border border-green-200">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm text-text-muted">
              <p className="flex items-center gap-2"><CalendarDays size={14} className="text-oak" />{formatDateLabel(slot.date || slot.startTime)}</p>
              <p className="flex items-center gap-2"><Clock3 size={14} className="text-oak" />{formatClock(slot.startTime)} - {formatClock(slot.endTime)}</p>
              <p className="flex items-center gap-2"><UserRound size={14} className="text-oak" />{slot.coach || 'TBA'}</p>
              <p className="flex items-center gap-2"><Users size={14} className="text-oak" />{slot.bookedCount || 0}/{slot.capacity || 0}</p>
              <p className="flex items-center gap-2"><Activity size={14} className="text-oak" />{slot.slotType || 'mixte'}</p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border-light pt-4">
              <p className="text-sm text-text-muted">
                Price: <span className="font-serif text-charcoal text-xl leading-none">{slot.price} DA</span>
              </p>
              <Link to="/booking">
                <Button variant="oak" size="sm">
                  Book Session
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
